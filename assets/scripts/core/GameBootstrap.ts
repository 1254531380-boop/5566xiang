import { _decorator, Component } from 'cc';
import { GameManager } from '../manager/GameManager';

const { ccclass } = _decorator;

/**
 * GameBootstrap
 * 启动引导组件，仅用于 Scene_Boot 中触发 GameManager 的动态创建
 */
@ccclass('GameBootstrap')
export class GameBootstrap extends Component {
    onLoad(): void {
        GameManager.Instance;
    }
}
