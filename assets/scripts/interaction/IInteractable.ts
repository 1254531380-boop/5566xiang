/**
 * IInteractable
 * 可交互对象接口契约
 *
 * 所有可交互组件（NPC、宝箱、传送点等）应实现此接口。
 * InteractionManager 通过此接口统一调度交互，不依赖具体类型。
 *
 * 架构原则：
 *   - 接口不引用任何 Manager，避免反向依赖
 *   - 实现类自行决定交互行为（对话、打开商店、拾取等）
 */
export interface IInteractable {
    /**
     * 获取交互对象唯一标识
     */
    getInteractId(): string;

    /**
     * 是否可交互（冷却、条件判断等由实现类决定）
     */
    canInteract(): boolean;

    /**
     * 执行交互（由 InteractionManager 在交互触发时调用）
     */
    interact(): void;
}
