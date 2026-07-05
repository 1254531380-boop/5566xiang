import { _decorator, Component, Node, director, find, Button } from 'cc';
import { SceneManager } from './SceneManager';
import { ConfigManager } from './ConfigManager';
import { EventManager } from './EventManager';
import { UIManager } from './UIManager';
import { AudioManager } from './AudioManager';
import { InputManager } from './InputManager';
import { SaveManager } from './SaveManager';
import { DialogueManager } from './DialogueManager';
import { CollisionManager } from './CollisionManager';

const { ccclass } = _decorator;

/**
 * GameManager
 * 游戏全局管理器，负责所有子管理器的生命周期与启动流程
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
        SceneManager.Instance.init();
        await ConfigManager.Instance.init();
        CollisionManager.Instance.init();
        EventManager.Instance.init();
        UIManager.Instance.init();
        AudioManager.Instance.init();
        InputManager.Instance.init();
        SaveManager.Instance.init();
        DialogueManager.Instance.init();

        SceneManager.Instance.loadScene('Scene_MainMenu', () => {
            this._setupMainMenu();
        });
    }

    private _setupMainMenu(): void {
        const buttonNode = find('Canvas/Button');
        if (buttonNode !== null) {
            const button = buttonNode.getComponent(Button);
            if (button !== null) {
                button.node.on(Button.EventType.CLICK, this.startGame, this);
            }
        }
    }

    public startGame(): void {
        SceneManager.Instance.loadScene('Scene_Village');
    }

    destroy(): void {
        SceneManager.Instance.destroy();
        ConfigManager.Instance.destroy();
        CollisionManager.Instance.destroy();
        EventManager.Instance.destroy();
        UIManager.Instance.destroy();
        AudioManager.Instance.destroy();
        InputManager.Instance.destroy();
        SaveManager.Instance.destroy();
        DialogueManager.Instance.destroy();
    }

    onDestroy(): void {
        if (GameManager._instance === this) {
            this.destroy();
            GameManager._instance = null;
        }
    }
}
