import { _decorator, Component, find, RigidBody2D, Vec2 } from 'cc';
import { ConfigManager } from '../manager/ConfigManager';
import { InputManager } from '../manager/InputManager';
import { UIConst } from '../const/UIConst';

const { ccclass } = _decorator;

/**
 * PlayerController
 * 玩家控制器，挂载于玩家节点（微信小游戏版）
 *
 * 架构原则：
 *   - 不监听任何输入事件（键盘/触摸/摇杆）
 *   - 移动方向从 InputManager.getAxis*() 查询
 *   - 交互由 InteractionManager.interact() 统一调度
 *   - 对外提供 move / stop / setMoveDirection 接口
 */
@ccclass('PlayerController')
export class PlayerController extends Component {
    private moveSpeed: number = 0;
    private body: RigidBody2D | null = null;
    private _directionX: number = 0;
    private _directionY: number = 0;

    onLoad(): void {
        const playerConfig = ConfigManager.Instance.getPlayerConfig();
        this.moveSpeed = playerConfig ? playerConfig.moveSpeed : 200;

        this.body = this.getComponent(RigidBody2D);
    }

    start(): void {
        const spawn = find(UIConst.PLAYER_SPAWN);
        if (spawn !== null) {
            const pos = spawn.position;
            this.node.setPosition(pos.x, pos.y, pos.z);
        }
    }

    update(deltaTime: number): void {
        // 从 InputManager 查询摇杆方向
        let x: number = InputManager.Instance.getAxisHorizontal();
        let y: number = InputManager.Instance.getAxisVertical();

        // 斜方向归一化
        if (x !== 0 && y !== 0) {
            const len: number = Math.sqrt(x * x + y * y);
            x /= len;
            y /= len;
        }

        this._directionX = x;
        this._directionY = y;

        if (this.body !== null) {
            this.body.setLinearVelocity(new Vec2(x * this.moveSpeed, y * this.moveSpeed));
        }
    }

    // ==================== 对外接口 ====================

    /**
     * 移动（设置方向并驱动 RigidBody2D）
     */
    public move(dirX: number, dirY: number): void {
        this._directionX = dirX;
        this._directionY = dirY;
        if (this.body !== null) {
            this.body.setLinearVelocity(new Vec2(dirX * this.moveSpeed, dirY * this.moveSpeed));
        }
    }

    /**
     * 停止移动
     */
    public stop(): void {
        this._directionX = 0;
        this._directionY = 0;
        if (this.body !== null) {
            this.body.setLinearVelocity(new Vec2(0, 0));
        }
    }

    /**
     * 设置移动方向（归一化后缓存）
     */
    public setMoveDirection(dirX: number, dirY: number): void {
        if (dirX !== 0 && dirY !== 0) {
            const len: number = Math.sqrt(dirX * dirX + dirY * dirY);
            dirX /= len;
            dirY /= len;
        }
        this._directionX = dirX;
        this._directionY = dirY;
    }

    /**
     * 交互入口（由 InteractionManager 调度，Player 自身不触发）
     */
    public interact(): void {
        // 预留：后续 Player 自身交互逻辑
    }

    destroy(): void {
        // 无输入监听需要卸载
    }

    onDestroy(): void {
        this.destroy();
    }
}
