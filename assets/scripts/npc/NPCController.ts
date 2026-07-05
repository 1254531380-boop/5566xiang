import { _decorator, Component } from 'cc';
import { NPCConst } from '../const/NPCConst';
import { Logger } from '../core/Logger';

const { ccclass } = _decorator;

/**
 * NPCController
 * NPC 控制器，挂载于 NPC 节点
 *
 * 架构原则：
 *   - Component 不知道 Manager 的存在，不主动 register/unregister
 *   - 由场景级 InteractionSystem 扫描并注册到 InteractionManager
 *   - 此处仅持有 NPC 自身数据，提供交互入口
 */
@ccclass('NPCController')
export class NPCController extends Component {
    private npcId: string = '';
    private displayName: string = '';

    onLoad(): void {
        // 默认配置为村长
        this.npcId = NPCConst.NPC_OLDMAN;
        this.displayName = NPCConst.OLDMAN_DISPLAY_NAME;
    }

    /**
     * 获取 NPC ID
     */
    public getNpcId(): string {
        return this.npcId;
    }

    /**
     * 获取 NPC 显示名
     */
    public getDisplayName(): string {
        return this.displayName;
    }

    /**
     * 交互入口，由 InteractionManager 在按键按下时调用
     */
    public interact(): void {
        Logger.info(`Interact : ${this.npcId}`);
    }
}
