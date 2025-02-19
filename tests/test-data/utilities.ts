// tslint:disable:max-classes-per-file
// tslint:disable:max-line-length
import { HttpStatusCode, IHttp, IModify, IPersistence, IRead } from '../../src/definition/accessors';
import { IMessage } from '../../src/definition/messages';
import { IRoom, RoomType } from '../../src/definition/rooms';
import { ISetting, SettingType } from '../../src/definition/settings';
import { ISlashCommand, ISlashCommandPreview, ISlashCommandPreviewItem, SlashCommandContext } from '../../src/definition/slashcommands';
import { IUser, UserStatusConnection, UserType } from '../../src/definition/users';

import { TestsAppBridges } from './bridges/appBridges';
import { TestsAppLogStorage } from './storage/logStorage';
import { TestsAppStorage } from './storage/storage';
import { TestSourceStorage } from './storage/TestSourceStorage';

import { ApiSecurity, ApiVisibility, IApi, IApiRequest, IApiResponse } from '../../src/definition/api';
import { IApiEndpointInfo } from '../../src/definition/api/IApiEndpointInfo';
import { App } from '../../src/definition/App';
import { AppStatus } from '../../src/definition/AppStatus';
import { AppVideoConference } from '../../src/definition/videoConferences/AppVideoConference';
import { VideoConference, VideoConferenceStatus } from '../../src/definition/videoConferences/IVideoConference';
import { IVideoConferenceUser } from '../../src/definition/videoConferences/IVideoConferenceUser';
import { IVideoConferenceOptions, IVideoConfProvider, VideoConfData, VideoConfDataExtended } from '../../src/definition/videoConfProviders';
import { AppManager } from '../../src/server/AppManager';
import { AppBridges } from '../../src/server/bridges';
import { ProxiedApp } from '../../src/server/ProxiedApp';
import { AppLogStorage, AppMetadataStorage, AppSourceStorage, IAppStorageItem } from '../../src/server/storage';

export class TestInfastructureSetup {
    private appStorage: TestsAppStorage;
    private logStorage: TestsAppLogStorage;
    private bridges: TestsAppBridges;
    private sourceStorage: TestSourceStorage;

    constructor() {
        this.appStorage = new TestsAppStorage();
        this.logStorage = new TestsAppLogStorage();
        this.bridges = new TestsAppBridges();
        this.sourceStorage = new TestSourceStorage();
    }

    public getAppStorage(): AppMetadataStorage {
        return this.appStorage;
    }

    public getLogStorage(): AppLogStorage {
        return this.logStorage;
    }

    public getAppBridges(): AppBridges {
        return this.bridges;
    }

    public getSourceStorage(): AppSourceStorage {
        return this.sourceStorage;
    }
}

const date = new Date();
export class TestData {
    public static getDate(): Date {
        return date;
    }

    public static getSetting(id?: string): ISetting {
        return {
            id: id ? id : 'testing',
            type: SettingType.STRING,
            packageValue: 'The packageValue',
            required: false,
            public: false,
            i18nLabel: 'Testing',
        };
    }

    public static getUser(id?: string, username?: string): IUser {
        return {
            id: id ? id : 'BBxwgCBzLeMC6esTb',
            username: username ? username : 'testing-user',
            name: 'Testing User',
            emails: [],
            type: UserType.USER,
            isEnabled: true,
            roles: ['admin'],
            status: 'online',
            statusConnection: UserStatusConnection.ONLINE,
            utcOffset: -5,
            createdAt: date,
            updatedAt: new Date(),
            lastLoginAt: new Date(),
        };
    }

    public static getRoom(id?: string, slugifiedName?: string): IRoom {
        return {
            id: id ? id : 'bTse6CMeLzBCgwxBB',
            slugifiedName: slugifiedName ? slugifiedName : 'testing-room',
            displayName: 'Testing Room',
            type: RoomType.CHANNEL,
            creator: TestData.getUser(),
            usernames: [TestData.getUser().username],
            isDefault: true,
            isReadOnly: false,
            displaySystemMessages: true,
            messageCount: 145,
            createdAt: date,
            updatedAt: new Date(),
            lastModifiedAt: new Date(),
        };
    }

    public static getMessage(id?: string, text?: string): IMessage {
        return {
            id: id ? id : '4bShvoOXqB',
            room: TestData.getRoom(),
            sender: TestData.getUser(),
            text: 'This is just a test, do not be alarmed',
            createdAt: date,
            updatedAt: new Date(),
            editor: TestData.getUser(),
            editedAt: new Date(),
            emoji: ':see_no_evil:',
            avatarUrl: 'https://avatars0.githubusercontent.com/u/850391?s=88&v=4',
            alias: 'Testing Bot',
            attachments: [{
                collapsed: false,
                color: '#00b2b2',
                text: 'Just an attachment that is used for testing',
                timestamp: new Date(),
                timestampLink: 'https://google.com/',
                thumbnailUrl: 'https://avatars0.githubusercontent.com/u/850391?s=88&v=4',
                author: {
                    name: 'Author Name',
                    link: 'https://github.com/graywolf336',
                    icon: 'https://avatars0.githubusercontent.com/u/850391?s=88&v=4',
                },
                title: {
                    value: 'Attachment Title',
                    link: 'https://github.com/RocketChat',
                    displayDownloadLink: false,
                },
                imageUrl: 'https://rocket.chat/images/default/logo.svg',
                audioUrl: 'http://www.w3schools.com/tags/horse.mp3',
                videoUrl: 'http://www.w3schools.com/tags/movie.mp4',
                fields: [
                    {
                        short: true,
                        title: 'Test',
                        value: 'Testing out something or other',
                    },
                    {
                        short: true,
                        title: 'Another Test',
                        value: '[Link](https://google.com/) something and this and that.',
                    },
                ],
            }],
        };
    }

    public static getSlashCommand(command?: string): ISlashCommand {
        return {
            command: command ? command : 'testing-cmd',
            i18nParamsExample: 'justATest',
            i18nDescription: 'justATest_Description',
            permission: 'create-c',
            providesPreview: true,
            executor: (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> => {
                return Promise.resolve();
            },
            previewer: (context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<ISlashCommandPreview> => {
                return Promise.resolve({
                    i18nTitle: 'my i18nTitle',
                    items: new Array(),
                } as ISlashCommandPreview);
            },
            executePreviewItem: (item: ISlashCommandPreviewItem, context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> => {
                return Promise.resolve();
            },
        };
    }

    public static getApi(path: string = 'testing-path', visibility: ApiVisibility = ApiVisibility.PUBLIC, security: ApiSecurity = ApiSecurity.UNSECURE): IApi {
        return {
            visibility,
            security,
            endpoints: [{
                path,
                get(request: IApiRequest, endpoint: IApiEndpointInfo, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<IApiResponse> {
                    return Promise.resolve({
                        status: HttpStatusCode.OK,
                    });
                },
            }],
        };
    }

    public static getVideoConfProvider(name = 'test'): IVideoConfProvider {
        return {
            name,

            async generateUrl(call: VideoConfData): Promise<string> {
                return `${name}/${call._id}`;
            },

            async customizeUrl(call: VideoConfDataExtended, user: IVideoConferenceUser | undefined, options: IVideoConferenceOptions): Promise<string> {
                return `${name}/${call._id}#${user ? user.username : ''}`;
            },
        };
    }

    public static getInvalidConfProvider(name = 'invalid'): IVideoConfProvider {
        return {
            name,

            async isFullyConfigured(): Promise<boolean> {
                return false;
            },

            async generateUrl(call: VideoConfData): Promise<string> {
                return ``;
            },

            async customizeUrl(call: VideoConfDataExtended, user: IVideoConferenceUser | undefined, options: IVideoConferenceOptions): Promise<string> {
                return ``;
            },
        };
    }

    public static getFullVideoConfProvider(name = 'test'): IVideoConfProvider {
        return {
            name,

            capabilities: {
                mic: true,
                cam: true,
                title: true,
            },

            async isFullyConfigured(): Promise<boolean> {
                return true;
            },

            async generateUrl(call: VideoConfData): Promise<string> {
                return `${name}/${call._id}`;
            },

            async customizeUrl(call: VideoConfDataExtended, user: IVideoConferenceUser | undefined, options: IVideoConferenceOptions): Promise<string> {
                return `${name}/${call._id}#${user ? user.username : ''}`;
            },
        };
    }

    public static getVideoConferenceUser(): IVideoConferenceUser {
        return {
            _id: 'callerId',
            username: 'caller',
            name: 'John Caller',
        };
    }

    public static getVideoConfData(): VideoConfData {
        return {
            _id: 'first-call',
            type: 'videoconference',
            rid: 'roomId',
            createdBy: this.getVideoConferenceUser(),
            title: 'Test Call',
        };
    }

    public static getVideoConfDataExtended(providerName = 'test'): VideoConfDataExtended {
        return {
            ...this.getVideoConfData(),
            url: '${providerName}/first-call',
        };
    }

    public static getAppVideoConference(): AppVideoConference {
        return {
            rid: 'roomId',
            createdBy: 'userId',
            title: 'Video Conference',
            providerName: 'test',
        };
    }

    public static getVideoConference(): VideoConference {
        return {
            _id: 'first-call',
            _updatedAt: new Date(),
            type: 'videoconference',
            rid: 'roomId',
            users: [
                {
                    _id: 'johnId',
                    name: 'John Doe',
                    username: 'mrdoe',
                    ts: new Date(),
                },
                {
                    _id: 'janeId',
                    name: 'Jane Doe',
                    username: 'msdoe',
                    ts: new Date(),
                },
            ],
            status: VideoConferenceStatus.STARTED,
            messages: {
                started: 'messageId',
            },
            url: 'video-conf/first-call',
            createdBy: {
                _id: 'johnId',
                name: 'John Doe',
                username: 'mrdoe',
            },
            createdAt: new Date(),
            title: 'Video Conference',
            anonymousUsers: 0,
            providerName: 'test',
        };
    }

    public static getOAuthApp(isToCreate: boolean) {

        const OAuthApp = {
            _id : '4526fcab-b068-4dcc-b208-4fff599165b0',
            name : 'name-test',
            active : true,
            clientId : 'clientId-test',
            clientSecret : 'clientSecret-test',
            redirectUri : 'redirectUri-test',
            appId : 'app-123',
            _createdAt : '2022-07-11T14:30:48.937Z',
            _createdBy : {
                _id : 'Em5TQwMD4P7AmTs73',
                username : 'testa.bot',
            },
            _updatedAt : '2022-07-11T14:30:48.937Z',
        };

        if (isToCreate) {
            delete OAuthApp._id;
            delete OAuthApp._createdAt;
            delete OAuthApp._createdBy;
            delete OAuthApp._updatedAt;
            delete OAuthApp.appId;
        }
        return OAuthApp;
    }

    public static getMockApp(id: string, name: string): ProxiedApp {
        return new ProxiedApp({} as AppManager, { status: AppStatus.UNKNOWN } as IAppStorageItem, {
            getName() { return 'testing'; },
            getID() { return 'testing'; },
            getRuntime() { return ({ runInSandbox: (mod: string) => mod }); },
        } as unknown as App, { runInSandbox: (mod: string) => mod } as any);
    }
}

export class SimpleClass {
    private readonly world: string;
    constructor(world = 'Earith') {
        this.world = world;
    }

    public getWorld(): string {
        return this.world;
    }
}
