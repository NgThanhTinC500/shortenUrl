import { Request, Response } from "express";
import { ShortenService } from "../services/shortenService";
import catchAsync from "../utils/catchAsync";

export class ShortenController {
  private shortenService = new ShortenService();

  createShortenUrl = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { originalUrl } = req.body;
    const data = await this.shortenService.createShortUrl(originalUrl);
    res.status(201).json({
      success: true,
      data,
      message: "Create shortUrl success",
    });
  });

  getAllUrl = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const allUrl = await this.shortenService.getAllUrl();
    res.status(200).json({ success: true, data: allUrl, message: "Get all URLs successfully", });
  });

  /**
   * Xử lý redirect: trigger lưu click log rồi redirect ngay.
   * Không await để tránh làm chậm trải nghiệm người dùng.
   */
  getOriginalUrl = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const code = String(req.params.code);
    const shortUrl = await this.shortenService.getShortUrlByCode(code);

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
    res.redirect(302, shortUrl.originalUrl);
  });
  getStats = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: "Invalid id" });
      return;
    }
    const stats = await this.shortenService.getStats(id);
    res.status(200).json({ success: true, data: stats, message: "Get stats successfully" });

  });
}