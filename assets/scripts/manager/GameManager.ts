import { _decorator, Component, Node, director, find, Button } from 'cc';
import { ManagerRegistry } from '../core/ManagerRegistry';
import { SceneManager } from './SceneManager';
import { ConfigManager } from './ConfigManager';
import { EventManager } from './EventManager';
import { UIManager } from './UIManager';
import { AudioManager } from './AudioManager';
import { InputManager } from './InputManager';
import { SaveManager } from './SaveManager';
import { DialogueManager } from './DialogueManager';
import { InteractionManager } from './InteractionManager';
import { PlatformManager } from './PlatformManager';
import { SceneConst } from '../const/SceneConst';
import { UIConst } from '../const/UIConst';
import { Logger } from '../core/Logger';

const { ccclass } = _decorator;

/**
 * GameManager
 * 游戏全局管理器，负责所有子管理器的生命周期与启动流程
 * 子管理器统一通过 ManagerRegistry 注册/初始化/销毁，避免此处无限膨胀
 */
@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager | null = null;

    public static get Instance(): GameManager {
        if (GameManager._instance === null) {
            const node = new Node('GameManager');
            director.addPersistRootNode(node);
            GameManager._instance = node.addComponent(GameManager);
        }
        return GameManager._instance;
    }

    private constructor() {
        super();
    }

    onLoad(): void {
        if (GameManager._instance !== null && GameManager._instance !== this) {
            this.node.destroy();
            return;
        }
        GameManager._instance = this;
        this.init();
    }

    async init(): Promise<void> {
        // 触发所有 Manager 的注册（访问 Instance getter 即完成注册到 ManagerRegistry）
        SceneManager.Instance;
        ConfigManager.Instance;
        EventManager.Instance;
        UIManager.Instance;
        AudioManager.Instance;
        InputManager.Instance;
        SaveManager.Instance;
        DialogueManager.Instance;
        InteractionManager.Instance;
        PlatformManager.Instance;

        // 统一按注册顺序串行初始化
        await ManagerRegistry.initAll();

        SceneManager.Instance.loadScene(SceneConst.MAIN_MENU, () => {
            this._setupMainMenu();
        });
    }

    private _setupMainMenu(): void {
        const buttonNode = find(UIConst.MAIN_MENU_BUTTON);
        if (buttonNode !== null) {
            const button = buttonNode.getComponent(Button);
            if (button !== null) {
                button.node.on(Button.EventType.CLICK, this.startGame, this);
            }
        }
    }

    public startGame(): void {
        SceneManager.Instance.loadScene(SceneConst.VILLAGE);
    }

    destroy(): void {
        // 按注册逆序统一销毁
        ManagerRegistry.destroyAll();
        Logger.info('GameManager destroyed');
    }

    onDestroy(): void {
        if (GameManager._instance === this) {
            this.destroy();
            GameManager._instance = null;
        }
    }
}
