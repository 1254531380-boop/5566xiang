import { _decorator, Component, find, RigidBody2D, Vec2 } from 'cc';
import { ConfigManager } from '../manager/ConfigManager';
import { InputManager } from '../manager/InputManager';
import { UIConst } from '../const/UIConst';

const { ccclass } = _decorator;

/**
 * PlayerController
 * 玩家控制器，挂载于玩家节点
 * 输入由 InputManager 统一接管，此处仅查询输入轴并驱动 RigidBody2D 移动
 * 碰撞由 Physics2D 处理
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
    private moveSpeed: number = 0;
    private body: RigidBody2D | null = null;

    onLoad(): void {
        const playerConfig = ConfigManager.Instance.getPlayerConfig();
        this.moveSpeed = playerConfig ? playerConfig.moveSpeed : 200;

        this.body = this.getComponent(RigidBody2D);
    }

    start(): void {
        // 出生点定位
        const spawn = find(UIConst.PLAYER_SPAWN);
        if (spawn !== null) {
            const pos = spawn.position;
            this.node.setPosition(pos.x, pos.y, pos.z);
        }
    }

    init(): void {
        // 保留接口，实际初始化在 start 中完成
    }

    update(deltaTime: number): void {
        // 从 InputManager 查询输入轴，不再直接监听键盘
        let x: number = InputManager.Instance.getAxisHorizontal();
        let y: number = InputManager.Instance.getAxisVertical();

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
        // 输入监听已由 InputManager 统一管理，此处无需 off
    }

    onDestroy(): void {
        this.destroy();
    }
}
