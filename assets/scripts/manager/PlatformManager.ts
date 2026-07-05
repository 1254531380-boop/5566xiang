import { BaseManager } from '../core/BaseManager';
import { ManagerRegistry } from '../core/ManagerRegistry';
import { Logger } from '../core/Logger';

/**
 * PlatformManager
 * 统一平台 API 封装层（微信小游戏版）
 *
 * 架构原则：
 *   - 所有 wx.xxx 调用必须经由此 Manager，禁止业务代码直接调用 wx
 *   - 平台判断统一由此处处理，业务代码不关心运行平台
 *   - 后续扩展其他平台（如抖音小游戏）只需在此处适配
 *
 * 禁止：
 *   - 业务代码直接调用 wx.login / wx.getSystemInfo 等
 *   - 业务代码中出现 if (wx) / if (window) 等平台判断
 */
export class PlatformManager extends BaseManager {
    private static _instance: PlatformManager | null = null;

    public static get Instance(): PlatformManager {
        if (PlatformManager._instance === null) {
            PlatformManager._instance = new PlatformManager();
            ManagerRegistry.register('PlatformManager', PlatformManager._instance);
        }
        return PlatformManager._instance;
    }

    private constructor() {
        super();
    }

    /** 是否为微信小游戏平台 */
    private _isWechat: boolean = false;

    /** 系统信息缓存 */
    private _systemInfo: WechatSystemInfo | null = null;

    init(): void {
        this._detectPlatform();
        Logger.info(`Platform: ${this._isWechat ? 'WeChat Mini Game' : 'Browser'}`);
    }

    destroy(): void {
        this._systemInfo = null;
    }

    // ==================== 平台检测 ====================

    private _detectPlatform(): void {
        if (typeof wx !== 'undefined') {
            this._isWechat = true;
        } else {
            this._isWechat = false;
        }
    }

    /**
     * 是否为微信小游戏平台
     */
    public isWechat(): boolean {
        return this._isWechat;
    }

    // ==================== 系统信息 ====================

    /**
     * 获取系统信息
     */
    public getSystemInfo(): WechatSystemInfo | null {
        if (this._systemInfo !== null) {
            return this._systemInfo;
        }

        if (this._isWechat && typeof wx !== 'undefined' && wx.getSystemInfoSync) {
            try {
                const info = wx.getSystemInfoSync();
                this._systemInfo = {
                    brand: info.brand || '',
                    model: info.model || '',
                    pixelRatio: info.pixelRatio || 1,
                    screenWidth: info.screenWidth || 0,
                    screenHeight: info.screenHeight || 0,
                    windowWidth: info.windowWidth || 0,
                    windowHeight: info.windowHeight || 0,
                    statusBarHeight: info.statusBarHeight || 0,
                    safeArea: info.safeArea || null,
                    system: info.system || '',
                    platform: info.platform || '',
                    SDKVersion: info.SDKVersion || '',
                };
            } catch (e) {
                Logger.error('wx.getSystemInfoSync failed:', e);
            }
        } else {
            // 浏览器降级
            this._systemInfo = {
                brand: 'Browser',
                model: 'PC',
                pixelRatio: window.devicePixelRatio || 1,
                screenWidth: window.screen.width || 960,
                screenHeight: window.screen.height || 640,
                windowWidth: window.innerWidth || 960,
                windowHeight: window.innerHeight || 640,
                statusBarHeight: 0,
                safeArea: null,
                system: 'Browser',
                platform: 'devtools',
                SDKVersion: '',
            };
        }

        return this._systemInfo;
    }

    // ==================== 登录 ====================

    /**
     * 微信登录
     */
    public login(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this._isWechat || typeof wx === 'undefined' || !wx.login) {
                Logger.info('Platform: login skipped (not WeChat)');
                resolve('');
                return;
            }
            wx.login({
                success: (res: { code: string }) => {
                    Logger.info('wx.login success');
                    resolve(res.code);
                },
                fail: (err: unknown) => {
                    Logger.error('wx.login failed:', err);
                    reject(err);
                },
            });
        });
    }

    // ==================== 震动反馈 ====================

    /**
     * 短震动
     */
    public vibrateShort(): void {
        if (this._isWechat && typeof wx !== 'undefined' && wx.vibrateShort) {
            wx.vibrateShort({ type: 'light' });
        }
    }

    /**
     * 长震动
     */
    public vibrateLong(): void {
        if (this._isWechat && typeof wx !== 'undefined' && wx.vibrateLong) {
            wx.vibrateLong();
        }
    }

    // ==================== 分享 ====================

    /**
     * 显示分享菜单
     */
    public showShareMenu(): void {
        if (this._isWechat && typeof wx !== 'undefined' && wx.showShareMenu) {
            wx.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline'],
            });
        }
    }

    // ==================== 广告 ====================

    /**
     * 创建激励视频广告（预留接口）
     */
    public createRewardedVideoAd(adUnitId: string): unknown | null {
        if (this._isWechat && typeof wx !== 'undefined' && wx.createRewardedVideoAd) {
            return wx.createRewardedVideoAd({ adUnitId });
        }
        return null;
    }

    /**
     * 创建插屏广告（预留接口）
     */
    public createInterstitialAd(adUnitId: string): unknown | null {
        if (this._isWechat && typeof wx !== 'undefined' && wx.createInterstitialAd) {
            return wx.createInterstitialAd({ adUnitId });
        }
        return null;
    }
}

/**
 * 微信系统信息类型定义
 */
export interface WechatSystemInfo {
    brand: string;
    model: string;
    pixelRatio: number;
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    statusBarHeight: number;
    safeArea: unknown | null;
    system: string;
    platform: string;
    SDKVersion: string;
}

/**
 * wx 全局类型声明
 * 在微信小游戏环境下 wx 为全局变量
 */
declare const wx: {
    login(options: { success?: (res: { code: string }) => void; fail?: (err: unknown) => void }): void;
    getSystemInfoSync(): Record<string, unknown>;
    vibrateShort(options: { type: string }): void;
    vibrateLong(): void;
    showShareMenu(options: { withShareTicket: boolean; menus: string[] }): void;
    createRewardedVideoAd(options: { adUnitId: string }): unknown;
    createInterstitialAd(options: { adUnitId: string }): unknown;
};
