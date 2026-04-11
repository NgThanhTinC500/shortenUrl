import { AppDataSource } from "../data-source";
import { Click } from "../entities/Click.entity";
import { ShortUrl } from "../entities/ShortUrl.entity";
import * as UAParser from "ua-parser-js";
import * as geoip from "geoip-lite";
import * as dotenv from "dotenv";
import { AppError } from "../utils/AppError";
dotenv.config();

// Interface chứa thông tin click cần lưu
export interface ClickMeta {
    ip: string;
    userAgent: string;
    referrer: string;
}

export class ShortenService {
    private shortenRepository = AppDataSource.getRepository(ShortUrl);
    private clickRepository = AppDataSource.getRepository(Click);

    async createShortUrl(originalUrl: string) {
        if (!originalUrl) {
            throw new AppError("originalUrl is required", 400);
        }
        const saved = await this.shortenRepository.save({ originalUrl });
        const code = this.convertToBase62(saved.id);
        saved.code = code;
        await this.shortenRepository.save(saved);

        return {
            id: saved.id,
            code,
            originalUrl,
            shortUrl: `${process.env.BASE_URL}/api/v1/${code}`,
        };
    }

    convertToBase62(urlId: number): string {
        const chars =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let base62 = "";
        while (urlId > 0) {
            base62 = chars[urlId % 62] + base62;
            urlId = Math.floor(urlId / 62);
        }
        return base62 || "0";
    }

    async getOriginalUrlByCode(code: string): Promise<string> {
        const data = await this.shortenRepository.findOne({
            where: { code },
            select: { originalUrl: true },
        });
        if (!data) throw new AppError("Short URL not found", 404);
        return data.originalUrl;
    }

    async getAllUrl(): Promise<ShortUrl[]> {
        return this.shortenRepository.find();
    }

    // ─── Click Tracking ───────────────────────────────────────────

    /**
     * Lưu log click và tăng counter.
     * Chạy song song với redirect nên không block user experience.
     */
    async recordClick(shortUrlId: number, meta: ClickMeta): Promise<void> {
        const { ip, userAgent, referrer } = meta;

        // Parse OS & browser từ User-Agent
        const parser = new UAParser.UAParser(userAgent);
        const os = parser.getOS().name ?? "Unknown";
        const browser = parser.getBrowser().name ?? "Unknown";

        // Tra cứu country từ IP (trả về null nếu không tìm thấy)
        const geo = geoip.lookup(ip);
        const country = geo?.country ?? "Unknown";

        await Promise.all([
            // Lưu bản ghi click
            this.clickRepository.save({
                shortUrlId,
                ip,
                os,
                browser,
                country,
                referrer: referrer || "Direct", // Không có referrer = truy cập trực tiếp
            }),
            // Tăng tổng số click (atomic increment)
            this.shortenRepository.increment({ id: shortUrlId }, "totalClicks", 1),
        ]);
    }

    /**
     * Tìm ShortUrl theo code, trả về cả id lẫn originalUrl để dùng cho tracking.
     */
    async getShortUrlByCode(
        code: string
    ): Promise<{ id: number; originalUrl: string }> {
        const shortUrl = await this.shortenRepository.findOne({
            where: { code },
            select: { id: true, originalUrl: true },
        });

        if (!shortUrl) {
            throw new AppError("Short URL not found", 404);
        }

        return shortUrl;
    }

    async getStats(id: number) {
        const shortUrl = await this.shortenRepository.findOne({
            where: { id },
            select: { id: true, totalClicks: true, originalUrl: true, code: true, createdAt: true },
        });

        if (!shortUrl) throw new AppError("Short URL not found", 404);

        const clicks = await this.clickRepository.find({
            where: { shortUrlId: id },
            select: {
                ip: true,
                browser: true,
                os: true,
                country: true,
                referrer: true,
                clickedAt: true,
            },
            order: {
                clickedAt: "DESC",
            },
        });

        const group = (key: keyof (typeof clicks)[number]) =>
            Object.entries(
                clicks.reduce((acc, c) => {
                    const val = String(c[key] ?? "Unknown");
                    acc[val] = (acc[val] ?? 0) + 1;
                    return acc;
                }, {} as Record<string, number>)
            )
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count);

        // Group theo giờ trong ngày: 0 -> 23
        const clicksByHourMap = clicks.reduce((acc, click) => {
            const hour = new Date(click.clickedAt).getHours();
            acc[hour] = (acc[hour] ?? 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        const clicksByHour = Array.from({ length: 24 }, (_, hour) => ({
            hour: `${hour.toString().padStart(2, "0")}:00`,
            clicks: clicksByHourMap[hour] ?? 0,
        }));

        const peakHour = clicksByHour.reduce(
            (max, current) => (current.clicks > max.clicks ? current : max),
            { hour: "00:00", clicks: 0 }
        );

        return {
            id: shortUrl.id,
            originalUrl: shortUrl.originalUrl,
            shortUrl: `${process.env.BASE_URL}/api/v1/${shortUrl.code}`,
            totalClicks: shortUrl.totalClicks,
            createdAt: shortUrl.createdAt,
            countries: group("country"),
            referrers: group("referrer"),
            os: group("os"),
            browsers: group("browser"),
            ips: group("ip"),
            clicksByHour,
            peakHour,
            clickDetails: clicks,
        };
    }
}