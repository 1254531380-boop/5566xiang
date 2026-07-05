import { _decorator, Component, input, InputEventType, KeyCode, find, RigidBody2D, Vec2 } from 'cc';
import { ConfigManager } from '../manager/ConfigManager';

const { ccclass } = _decorator;

/**
 * PlayerController
 * 玩家控制器，挂载于玩家节点，处理 WASD 输入
 * 通过 RigidBody2D.setLinearVelocity 驱动移动，碰撞由 Physics2D 处理
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
    private keyW: boolean = false;
    private keyA: boolean = false;
    private keyS: boolean = false;
    private keyD: boolean = false;

    private moveSpeed: number = 0;
    private body: RigidBody2D | null = null;

    onLoad(): void {
        const playerConfig = ConfigManager.Instance.getPlayerConfig();
        this.moveSpeed = playerConfig ? playerConfig.moveSpeed : 200;

        this.body = this.getComponent(RigidBody2D);

        input.on(InputEventType.KEY_DOWN, this.onKeyDown, this);
        input.on(InputEventType.KEY_UP, this.onKeyUp, this);
    }

    start(): void {
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

        // 通过 RigidBody2D 设置线速度，碰撞由 Physics2D 处理
        if (this.body !== null) {
            this.body.setLinearVelocity(new Vec2(x * this.moveSpeed, y * this.moveSpeed));
        }
    }

    destroy(): void {
        input.off(InputEventType.KEY_DOWN, this.onKeyDown, this);
        input.off(InputEventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy(): void {
        this.destroy();
    }
}
