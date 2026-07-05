/**
 * Logger
 * 统一日志系统，支持一键关闭（发布微信小游戏时）
 *
 * 使用方式：
 *   Logger.info('Config loaded')
 *   Logger.warn('Deprecated API:', detail)
 *   Logger.error('Load failed:', err)
 *
 * 发布时调用 Logger.setEnabled(false) 即可关闭所有日志
 */
export class Logger {
    private static enabled: boolean = true;

    private static readonly PREFIX_INFO: string = '[INFO]';
    private static readonly PREFIX_WARN: string = '[WARN]';
    private static readonly PREFIX_ERROR: string = '[ERROR]';

    /**
     * 设置日志总开关
     */
    public static setEnabled(enabled: boolean): void {
        Logger.enabled = enabled;
    }

    /**
     * 是否启用日志
     */
    public static isEnabled(): boolean {
        return Logger.enabled;
    }

    public static info(message: string, ...optionalParams: unknown[]): void {
        if (!Logger.enabled) { return; }
        console.log(Logger.PREFIX_INFO, message, ...optionalParams);
    }

    public static warn(message: string, ...optionalParams: unknown[]): void {
        if (!Logger.enabled) { return; }
        console.warn(Logger.PREFIX_WARN, message, ...optionalParams);
    }

    public static error(message: string, ...optionalParams: unknown[]): void {
        if (!Logger.enabled) { return; }
        console.error(Logger.PREFIX_ERROR, message, ...optionalParams);
    }
}
