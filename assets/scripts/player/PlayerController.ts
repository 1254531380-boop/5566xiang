import { _decorator, Component, input, InputEventType, KeyCode, find, Rect, UITransform } from 'cc';
import { ConfigManager } from '../manager/ConfigManager';
import { CollisionManager } from '../manager/CollisionManager';

const { ccclass } = _decorator;

/**
 * PlayerController
 * 玩家控制器，挂载于玩家节点，处理 WASD 移动与碰撞检测
 * 采用分轴 AABB 检测，支持沿墙滑动
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
    private keyW: boolean = false;
    private keyA: boolean = false;
    private keyS: boolean = false;
    private keyD: boolean = false;

    private moveSpeed: number = 0;
    private halfWidth: number = 25;
    private halfHeight: number = 25;

    onLoad(): void {
        const playerConfig = ConfigManager.Instance.getPlayerConfig();
        this.moveSpeed = playerConfig ? playerConfig.moveSpeed : 200;

        const ut = this.getComponent(UITransform);
        if (ut !== null) {
            this.halfWidth = ut.width / 2;
            this.halfHeight = ut.height / 2;
        }

        input.on(InputEventType.KEY_DOWN, this.onKeyDown, this);
        input.on(InputEventType.KEY_UP, this.onKeyUp, this);
    }

    start(): void {
        // 刷新障碍物列表
        CollisionManager.Instance.refresh();

        // 出生点定位
        const spawn = find('Canvas/PlayerSpawn');
        if (spawn !== null) {
            const pos = spawn.position;
            this.node.setPosition(pos.x, pos.y, pos.z);
        }
    }

    init(): void {
        // 保留接口，实际初始化在 start 中完成
    }

    private onKeyDown(event: { keyCode: number }): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.keyW = true;
                break;
            case KeyCode.KEY_A:
                this.keyA = true;
                break;
            case KeyCode.KEY_S:
                this.keyS = true;
                break;
            case KeyCode.KEY_D:
                this.keyD = true;
                break;
        }
    }

    private onKeyUp(event: { keyCode: number }): void {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.keyW = false;
                break;
            case KeyCode.KEY_A:
                this.keyA = false;
                break;
            case KeyCode.KEY_S:
                this.keyS = false;
                break;
            case KeyCode.KEY_D:
                this.keyD = false;
                break;
        }
    }

    update(deltaTime: number): void {
        let x: number = 0;
        let y: number = 0;

        if (this.keyW) { y += 1; }
        if (this.keyS) { y -= 1; }
        if (this.keyA) { x -= 1; }
        if (this.keyD) { x += 1; }

        // 斜方向归一化
        if (x !== 0 && y !== 0) {
            const len: number = Math.sqrt(x * x + y * y);
            x /= len;
            y /= len;
        }

        if (x === 0 && y === 0) {
            return;
        }

        const dx = x * this.moveSpeed * deltaTime;
        const dy = y * this.moveSpeed * deltaTime;

        const pos = this.node.position;
        const hw = this.halfWidth;
        const hh = this.halfHeight;

        // 分轴检测：先 X 后 Y，实现沿墙滑动
        let newX = pos.x;
        let newY = pos.y;

        // 测试 X 轴移动
        if (dx !== 0) {
            const rectX = new Rect(pos.x + dx - hw, pos.y - hh, hw * 2, hh * 2);
            if (!CollisionManager.Instance.testCollision(rectX)) {
                newX = pos.x + dx;
            }
        }

        // 测试 Y 轴移动（基于已更新的 X）
        if (dy !== 0) {
            const rectY = new Rect(newX - hw, pos.y + dy - hh, hw * 2, hh * 2);
            if (!CollisionManager.Instance.testCollision(rectY)) {
                newY = pos.y + dy;
            }
        }

        this.node.setPosition(newX, newY, pos.z);
    }

    destroy(): void {
        input.off(InputEventType.KEY_DOWN, this.onKeyDown, this);
        input.off(InputEventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy(): void {
        this.destroy();
    }
}
