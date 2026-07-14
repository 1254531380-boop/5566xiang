import { _decorator, Component, Node, find } from 'cc';
import { UIConst } from '../const/UIConst';
import { Logger } from '../core/Logger';

const { ccclass } = _decorator;

/**
 * CameraController
 * 摄像机控制器，跟随玩家节点，保持玩家位于屏幕中央
 */
@ccclass('CameraController')
export class CameraController extends Component {
    private target: Node | null = null;

    onLoad(): void {
        this.target = find(UIConst.PLAYER);
        if (this.target === null) {
            Logger.warn('CameraController: Player node not found, will retry in lateUpdate');
        }
    }

    lateUpdate(deltaTime: number): void {
        if (this.target === null) {
            this.target = find(UIConst.PLAYER);
            if (this.target === null) {
                return;
            }
        }

        const targetPos = this.target.position;
        const cameraPos = this.node.position;
        this.node.setPosition(targetPos.x, targetPos.y, cameraPos.z);
    }

    onDestroy(): void {
        this.target = null;
        super.onDestroy();
    }
}
