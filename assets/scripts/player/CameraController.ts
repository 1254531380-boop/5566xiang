import { _decorator, Component, Node, find } from 'cc';

const { ccclass } = _decorator;

/**
 * CameraController
 * 摄像机控制器，跟随玩家节点，保持玩家位于屏幕中央
 */
@ccclass('CameraController')
export class CameraController extends Component {
    private target: Node | null = null;

    init(): void {
        this.target = find('Canvas/Player');
    }

    lateUpdate(deltaTime: number): void {
        if (this.target === null) {
            this.target = find('Canvas/Player');
            if (this.target === null) {
                return;
            }
        }

        const targetPos = this.target.position;
        const cameraPos = this.node.position;
        this.node.setPosition(targetPos.x, targetPos.y, cameraPos.z);
    }

    destroy(): void {
        this.target = null;
    }

    onDestroy(): void {
        this.destroy();
    }
}
