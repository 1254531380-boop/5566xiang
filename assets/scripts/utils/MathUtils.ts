import { Vec3 } from 'cc';

/**
 * MathUtils
 * 数学工具类（性能优化版）
 *
 * 架构原则：
 *   - 距离比较统一使用平方距离，避免 Math.sqrt 开销
 *   - 所有方法为静态方法，无状态
 *   - 微信小游戏场景下高频调用，性能优先
 */
export class MathUtils {
    /**
     * 计算两点间平方距离（避免 sqrt 开销）
     * @returns dx*dx + dy*dy
     */
    public static distanceSqXy(ax: number, ay: number, bx: number, by: number): number {
        const dx: number = bx - ax;
        const dy: number = by - ay;
        return dx * dx + dy * dy;
    }

    /**
     * 计算两个 Vec3 间平方距离（仅 XY 分量）
     */
    public static distanceSqVec3Xy(a: Vec3, b: Vec3): number {
        const dx: number = b.x - a.x;
        const dy: number = b.y - a.y;
        return dx * dx + dy * dy;
    }

    /**
     * 判断两点平方距离是否在指定范围内
     * @param rangeSq 范围的平方（如 120*120=14400）
     */
    public static isInRangeSq(ax: number, ay: number, bx: number, by: number, rangeSq: number): boolean {
        return MathUtils.distanceSqXy(ax, ay, bx, by) <= rangeSq;
    }

    /**
     * 钳制数值到 [min, max] 区间
     */
    public static clamp(value: number, min: number, max: number): number {
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }

    /**
     * 归一化 2D 向量（原地修改）
     * @returns 归一化后的向量长度（0 表示零向量，未修改）
     */
    public static normalizeXy(x: number, y: number): { x: number; y: number; len: number } {
        const len: number = Math.sqrt(x * x + y * y);
        if (len === 0) {
            return { x: 0, y: 0, len: 0 };
        }
        return { x: x / len, y: y / len, len: len };
    }
}
