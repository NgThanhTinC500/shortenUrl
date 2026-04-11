import { Request, Response } from "express";
import { ShortenService } from "../services/shortenService";

export class ShortenController {
  private shortenService = new ShortenService();

  createShortenUrl = async (req: Request, res: Response): Promise<void> => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      res
        .status(400)
        .json({ success: false, message: "originalUrl is required" });
      return;
    }
    try {
      const data = await this.shortenService.createShortUrl(originalUrl);
      res
        .status(201)
        .json({ success: true, data, message: "Create shortUrl success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getAllUrl = async (req: Request, res: Response): Promise<void> => {
    try {
      const allUrl = await this.shortenService.getAllUrl();
      res.status(200).json({ success: true, data: allUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  /**
   * Xử lý redirect: lưu click log TRƯỚC khi redirect.
   * Fire-and-forget để không làm chậm redirect.
   */
  getOriginalUrl = async (req: Request, res: Response): Promise<void> => {
    const code = String(req.params.code);

    try {
      const shortUrl = await this.shortenService.getShortUrlByCode(code);

      if (!shortUrl) {
        res.status(404).json({ success: false, message: "Short URL not found" });
        return;
      }

      // Lấy IP đúng khi app chạy sau reverse proxy (Nginx, Cloudflare...)
      // x-forwarded-for có thể chứa nhiều IP: "client, proxy1, proxy2"
      const forwarded = req.headers["x-forwarded-for"];
      const ip =
        (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0])?.trim()
        ?? req.socket.remoteAddress
        ?? "Unknown";

      const meta = {
        ip,
        userAgent: req.headers["user-agent"] ?? "",
        referrer: req.headers["referer"] ?? "", // HTTP spec dùng "referer" (typo lịch sử)
      };

      // Fire-and-forget: không await để redirect ngay lập tức
      // Lỗi tracking không ảnh hưởng đến user
      this.shortenService.recordClick(shortUrl.id, meta).catch((err) => {
        console.error("[Click Tracking Error]", err);
      });

      // Redirect ngay, không chờ tracking hoàn thành
      res.redirect(301, shortUrl.originalUrl);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  getStats = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid id" });
      return;
    }
    try {
      const stats = await this.shortenService.getStats(id);
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      const isNotFound = error?.message === "Short URL not found";
      res.status(isNotFound ? 404 : 500).json({
        success: false,
        message: error?.message ?? "Internal server error",
      });
    }
  };
}