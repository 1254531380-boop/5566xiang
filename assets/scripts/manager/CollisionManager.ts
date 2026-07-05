import { find, Rect, BoxCollider2D, UITransform } from 'cc';

/**
 * CollisionManager
 * 地图碰撞管理器，负责管理所有障碍物的碰撞检测
 * 使用 AABB 包围盒进行碰撞判定，支持分轴检测以实现沿墙滑动
 */
export class CollisionManager {
    private static _instance: CollisionManager | null = null;

    public static get Instance(): CollisionManager {
        if (CollisionManager._instance === null) {
            CollisionManager._instance = new CollisionManager();
        }
        return CollisionManager._instance;
    }

    private constructor() {}

    private obstacleRects: Rect[] = [];
    private isInitialized: boolean = false;

    init(): void {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        this.obstacleRects = [];
    }

    /**
     * 刷新障碍物列表
     * 从 Canvas/MapRoot/CollisionRoot 下收集所有 BoxCollider2D 对应的 AABB
     * 应在场景加载完成后调用
     */
    refresh(): void {
        this.obstacleRects = [];
        const root = find('Canvas/MapRoot/CollisionRoot');
        if (root === null) {
            return;
        }
        const colliders = root.getComponentsInChildren(BoxCollider2D);
        for (const collider of colliders) {
            const ut = collider.node.getComponent(UITransform);
            if (ut === null) {
                continue;
            }
            const wp = collider.node.worldPosition;
            const w = ut.width;
            const h = ut.height;
            this.obstacleRects.push(new Rect(wp.x - w / 2, wp.y - h / 2, w, h));
        }
    }

    /**
     * 测试给定矩形是否与任何障碍物发生碰撞
     * @param rect 待测试的矩形（世界坐标）
     * @returns true 表示发生碰撞
     */
    testCollision(rect: Rect): boolean {
        for (const obstacle of this.obstacleRects) {
            if (rect.intersects(obstacle)) {
                return true;
            }
        }
        return false;
    }

    destroy(): void {
        this.obstacleRects = [];
        this.isInitialized = false;
    }
}
