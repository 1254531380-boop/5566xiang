import { _decorator, Component, Node, find, Label } from 'cc';
import { InteractionManager } from '../manager/InteractionManager';
import { NPCController } from '../npc/NPCController';
import { UIConst } from '../const/UIConst';

const { ccclass } = _decorator;

/**
 * InteractionSystem
 * 场景级交互系统，挂载于场景的 GameRoot 节点下
 * 职责：
 *   1. 每帧驱动 InteractionManager.tick（Manager 不依赖 Component 生命周期）
 *   2. 场景加载时扫描 NPC 并注册到 InteractionManager
 *   3. 缓存 Player 节点与交互 Label 引用，避免每帧 find
 *
 * Manager 永远不创建 Node、不监听 update，统一由 System 层驱动。
 */
@ccclass('InteractionSystem')
export class InteractionSystem extends Component {
    onLoad(): void {
        // 缓存 Player 引用
        const player = find(UIConst.PLAYER);
        if (player !== null) {
            InteractionManager.Instance.setPlayer(player);
        }

        // 缓存交互提示 Label 引用
        const uiNode = find(UIConst.INTERACTION_UI);
        if (uiNode !== null) {
            const label = uiNode.getComponent(Label);
            if (label !== null) {
                InteractionManager.Instance.setPromptLabel(label);
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
        InteractionManager.Instance.tick();
    }

    onDestroy(): void {
        InteractionManager.Instance.clearScene();
    }
}
