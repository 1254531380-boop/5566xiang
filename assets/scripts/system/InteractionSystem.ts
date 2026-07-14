import { _decorator, Component, Node, find, Label } from 'cc';
import { InteractionManager } from '../manager/InteractionManager';
import { NPCController } from '../npc/NPCController';
import { UIConst } from '../const/UIConst';
import { NPCConst } from '../const/NPCConst';

const { ccclass } = _decorator;

/**
 * InteractionSystem
 * 场景级交互系统，挂载于场景的 GameRoot 节点下
 * 职责：
 *   1. 每帧驱动 InteractionManager.tick（Manager 不依赖 Component 生命周期）
 *   2. 场景加载时扫描 NPC 并注册到 InteractionManager
 *   3. 缓存 Player 节点与交互 Label 引用，避免每帧 find
 *   4. 查询 Manager 状态并更新交互提示 UI（Manager 不操作 UI 组件）
 *
 * Manager 永远不创建 Node、不监听 update、不操作 UI，统一由 System 层驱动。
 */
@ccclass('InteractionSystem')
export class InteractionSystem extends Component {
    private promptLabel: Label | null = null;

    onLoad(): void {
        // 缓存 Player 引用
        const player = find(UIConst.PLAYER);
        if (player !== null) {
            InteractionManager.Instance.setPlayer(player);
        }

        // 缓存交互提示 Label 引用（UI 由 System 管理，非 Manager）
        const uiNode = find(UIConst.INTERACTION_UI);
        if (uiNode !== null) {
            const label = uiNode.getComponent(Label);
            if (label !== null) {
                this.promptLabel = label;
                label.string = '';
                label.enabled = false;
            }
        }

        // 扫描场景中所有 NPC 并注册到 InteractionManager
        this._scanAndRegisterNPCs();
    }

    /**
     * 递归扫描 NPC（挂载 NPCController 的节点）
     */
    private _scanAndRegisterNPCs(): void {
        const canvas = find(UIConst.CANVAS);
        if (canvas === null) {
            return;
        }
        this._scanNodeRecursive(canvas);
    }

    private _scanNodeRecursive(node: Node): void {
        const npc = node.getComponent(NPCController);
        if (npc !== null) {
            InteractionManager.Instance.registerNPC(npc);
        }
        const children = node.children;
        for (let i: number = 0; i < children.length; i++) {
            this._scanNodeRecursive(children[i]);
        }
    }

    update(deltaTime: number): void {
        // 驱动 Manager 逻辑
        InteractionManager.Instance.tick();

        // 查询 Manager 状态并更新 UI（Manager 不操作 UI 组件）
        if (this.promptLabel !== null) {
            if (InteractionManager.Instance.hasInteractionTarget()) {
                this.promptLabel.string = NPCConst.INTERACTION_PROMPT;
                this.promptLabel.enabled = true;
            } else {
                this.promptLabel.string = '';
                this.promptLabel.enabled = false;
            }
        }
    }

    onDestroy(): void {
        InteractionManager.Instance.clearScene();
        this.promptLabel = null;
        super.onDestroy();
    }
}
