import { _decorator, Component } from 'cc';
import { NPCConst } from '../const/NPCConst';
import { Logger } from '../core/Logger';
import { IInteractable } from '../interaction/IInteractable';

const { ccclass } = _decorator;

/**
 * NPCController
 * NPC 控制器，挂载于 NPC 节点
 *
 * 架构原则：
 *   - Component 不知道 Manager 的存在，不主动 register/unregister
 *   - 由场景级 InteractionSystem 扫描并注册到 InteractionManager
 *   - 此处仅持有 NPC 自身数据，提供交互入口
 *   - npcId 从节点名读取，displayName 通过 NPCConst 查询
 *   - 实现 IInteractable 接口，符合统一交互契约
 */
@ccclass('NPCController')
export class NPCController extends Component implements IInteractable {
    private npcId: string = '';
    private displayName: string = '';

    onLoad(): void {
        // 从节点名识别 NPC 身份
        const nodeName: string = this.node.name;
        if (nodeName === NPCConst.OLDMAN_NODE_NAME) {
            this.npcId = NPCConst.NPC_OLDMAN;
            this.displayName = NPCConst.OLDMAN_DISPLAY_NAME;
        } else {
            // 未知 NPC：以节点名作为兜底标识，待配置系统完善后从 npc.json 读取
            this.npcId = nodeName;
            this.displayName = nodeName;
            Logger.warn(`NPCController: unknown NPC node "${nodeName}", using node name as fallback`);
        }
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

    // ==================== IInteractable 接口实现 ====================

    /**
     * 交互对象唯一标识
     */
    public getInteractId(): string {
        return this.npcId;
    }

    /**
     * 是否可交互（默认始终可交互，子类可重写以加入条件判断）
     */
    public canInteract(): boolean {
        return true;
    }

    /**
     * 执行交互，由 InteractionManager 在交互触发时调用
     */
    public interact(): void {
        Logger.info(`Interact : ${this.npcId}`);
    }
}
