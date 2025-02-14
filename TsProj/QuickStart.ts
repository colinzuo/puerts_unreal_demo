import * as UE from 'ue'
import {$ref, $unref, $set, argv, on, toManualReleaseDelegate, releaseManualReleaseDelegate, blueprint} from 'puerts';

import { UTF8TextDecoder, UTF8TextEncoder } from './text-encoding';
import { UEWebsocket } from './websocket';
import { FrameImpl, Client } from './stompjs';
import { gStompController, StompController, StompControllerConfig } from './stomp-controller';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function displayIncomingMessage(user, message) {
    console.log(`user ${user}: ${message}`);
}

debugger;
console.log("before QuickStartMain");

console.log("WebSocketFunctionLibrary.GetLogVerbosity before set", UE.WebSocketFunctionLibrary.GetLogVerbosity());

UE.WebSocketFunctionLibrary.SetLogVerbosity("Verbose");

console.log("WebSocketFunctionLibrary.GetLogVerbosity after set", UE.WebSocketFunctionLibrary.GetLogVerbosity());

async function QuickStartMain_Part_InitialSleep() {
    console.log("QuickStartMain_Part_InitialSleep enter", new Date().toISOString());

    console.log("0 before sleep", new Date().toISOString());
    setTimeout(() => {
        console.log("0 timeout", new Date().toISOString());
    }, 5000);

    // 刚启动时候setTimeout设计的timer会比预期提前timeout，感觉
    // 像是timer起始点并没有和new Date获取一致
    console.log("before sleep", new Date().toISOString());
    await sleep(10000);
    console.log("after sleep", new Date().toISOString());

    console.log("QuickStartMain_Part_InitialSleep leave", new Date().toISOString());
}

async function QuickStartMain_Part_TextEncoding() {
    console.log("QuickStartMain_Part_TextEncoding enter", new Date().toISOString());    

    ////////////////    UTF8TextEncoder UTF8TextDecoder    ////////////////////////////////
    let testStr1 = "我的中国心";

    let testStr1Encoded = (new UTF8TextEncoder()).encode(testStr1);
    let testStr1Decoded = (new UTF8TextDecoder()).decode(testStr1Encoded);

    console.log(`testStr1Encoded ${testStr1Encoded}`);
    console.log(`testStr1Decoded ${testStr1Decoded}`);

    console.log("QuickStartMain_Part_TextEncoding leave", new Date().toISOString());
}

async function QuickStartMain_Part_UEWebsocket() {
    console.log("QuickStartMain_Part_UEWebsocket enter", new Date().toISOString());

    let websocket = new UEWebsocket("ws://172.16.23.70:15674/ws", "v12.stomp");

    websocket.onclose = (event) => {
        const closeStr = JSON.stringify(event);
        console.log(`websocket.onclose: ${closeStr}`);
    };

    websocket.onerror = (event) => {
        console.log(`websocket.onerror: ${event}`);
    };

    websocket.onmessage = (event) => {
        let message: string;

        if (typeof event.data == "string") {
            message = event.data;
        } else {
            message = new UTF8TextDecoder().decode(event.data);
        }

        console.log(`websocket.onmessage: message ${message}`);
    };

    websocket.onopen = () => {
        console.log("websocket.onopen");

        let command = "CONNECT";
        let headers = {
            'login': 'guest',
            'passcode': 'guest',
            'accept-version': '1.0,1.1,1.2',
            'heart-beat': '20000,20000',
        };

        let connectFrame = new FrameImpl({
            command,
            headers,
        });
        let message = connectFrame.serialize();

        console.log(`to send message: ${connectFrame}`);

        let encodedMessage: Uint8Array = new UTF8TextEncoder().encode(message);

        console.log(`encodedMessage length ${encodedMessage.length}`);

        websocket.send(encodedMessage);
    };

    websocket.connect();

    console.log("before sleep", new Date().toISOString());
    await sleep(30000);
    console.log("after sleep", new Date().toISOString());

    console.log("QuickStartMain_Part_UEWebsocket leave", new Date().toISOString());
}

async function QuickStartMain_Part_Stompjs() {
    console.log("QuickStartMain_Part_Stompjs enter", new Date().toISOString());

    let stompClient = new Client({
        "brokerURL": "ws://172.16.23.70:15674/ws",

        connectHeaders: {
            login: "guest",
            passcode: "guest"
        },

        debug: function (str) {
            console.log('STOMP: ' + str);
        },

        // Subscriptions should be done inside onConnect as those need to reinstated when the broker reconnects
        onConnect: function (frame) {
            console.log('onConnect Enter');
            
            // The return object has a method called `unsubscribe`
            const subscription = stompClient.subscribe(
            '/topic/chat', function (message) {
                const payload = JSON.parse(message.body);
                displayIncomingMessage(payload.user, payload.message);
            });
        },
    });

    stompClient.activate();

    console.log("before sleep", new Date().toISOString());
    await sleep(30000);
    console.log("after sleep", new Date().toISOString());

    console.log("QuickStartMain_Part_Stompjs leave", new Date().toISOString());
}

async function QuickStartMain_Part_StompController() {
    console.log("QuickStartMain_Part_StompController enter", new Date().toISOString());

    let controllerConfig = new StompControllerConfig();
    controllerConfig.brokerURL = "ws://172.16.23.70:15674/ws";
    controllerConfig.controllerId = "QuickStart";

    let stompController = new StompController(controllerConfig);

    gStompController.start();

    console.log("QuickStartMain_Part_StompController leave", new Date().toISOString());
}

async function QuickStartMain_Part_Orig() {
    console.log("QuickStartMain_Part_Orig enter");

    ////////////////    UE.MainObject    ////////////////////////////////
    let obj = new UE.MainObject();

    //调试器通过websocket发送断点信息，可能断点生效前脚本已经执行完备，可以通过debugger语句来主动触发断点
    //debugger;
    
    //成员访问
    console.log("------------------------0----------------------------");
    console.log("before set", obj.MyString)
    obj.MyString = "PPPPP";
    console.log("after set", obj.MyString)
    
    //简单类型参数函数
    console.log("------------------------1----------------------------");
    let sum = obj.Add(100, 300);
    console.log('sum', sum)
    
    //复杂类型参数函数
    console.log("------------------------2----------------------------");
    obj.Bar(new UE.Vector(1, 2, 3));
    
    //引用类型参数函数
    console.log("------------------------3----------------------------");
    let vectorRef = $ref(new UE.Vector(1, 2, 3))
    obj.Bar2(vectorRef);
    obj.Bar($unref(vectorRef));
    
    ////////////////    UE.JSBlueprintFunctionLibrary    ////////////////////////////////
    //静态方法
    console.log("-----------------------4-----------------------------");
    let str1 = UE.JSBlueprintFunctionLibrary.GetName();
    let str2 = UE.JSBlueprintFunctionLibrary.Concat(', ', str1);
    UE.JSBlueprintFunctionLibrary.Hello(str2);
    
    //扩展方法，和C#的扩展方法类似
    console.log("-----------------------5-----------------------------");
    let v = new UE.Vector(3, 2, 1)
    console.log(v.ToString());
    v.Set(8, 88, 888)
    console.log(v.ToString());
    
    //静态wrap
    console.log("-----------------------6-----------------------------");
    let vec = new UE.Vector(1, 2, 3)
    console.log('vec', vec.ToString())
    vec.X = 3
    vec.Y = 2
    vec.Z = 1
    vec.Normalize(1)
    console.log('vec', vec.ToString())
    console.log(vec.Projection().ToString())
    console.log('vec', vec.ToString())
    
    //枚举
    console.log("-----------------------7-----------------------------");
    obj.EnumTest(UE.EToTest.V1);
    obj.EnumTest(UE.EToTest.V13);
    
    //默认值
    console.log("-----------------------8-----------------------------");
    obj.DefaultTest();
    obj.DefaultTest("hello john");
    obj.DefaultTest("hello john", 1024);
    obj.DefaultTest("hello john", 1024, new UE.Vector(7, 8, 9));
    
    //定长数组
    console.log("-----------------------9-----------------------------");
    console.log("MyFixSizeArray.Num()", obj.MyFixSizeArray.Num())
    console.log("MyFixSizeArray[32]", obj.MyFixSizeArray.Get(32))
    console.log("MyFixSizeArray[33]", obj.MyFixSizeArray.Get(33))
    console.log("MyFixSizeArray[34]", obj.MyFixSizeArray.Get(34))
    obj.MyFixSizeArray.Set(33, 1000)
    console.log("MyFixSizeArray[32]", obj.MyFixSizeArray.Get(32))
    console.log("MyFixSizeArray[33]", obj.MyFixSizeArray.Get(33))
    console.log("MyFixSizeArray[34]", obj.MyFixSizeArray.Get(34))
    
    //TArray
    console.log("------------------------10----------------------------");
    function printTArray<T>(arr: UE.TArray<T>)
    {
        console.log("-----Num:", arr.Num());
        for(var i=0; i < arr.Num(); i++) {
            console.log(i, ":", arr.Get(i));
        }
    }
    printTArray(obj.MyArray);
    obj.MyArray.Add(888);
    obj.MyArray.Set(0, 7);
    printTArray(obj.MyArray);
    
    //TSet
    console.log("------------------------11----------------------------");
    console.log(obj.MySet.Num())
    console.log(obj.MySet.Contains("John"));
    console.log(obj.MySet.Contains("Che"));
    console.log(obj.MySet.Contains("Hello"));
    
    //TMap
    console.log("------------------------12----------------------------");
    console.log(obj.MyMap.Get("John"))
    console.log(obj.MyMap.Get("Che"))
    console.log(obj.MyMap.Get("Hello"))
    obj.MyMap.Add("Che", 10)
    console.log(obj.MyMap.Get("Che"))
    
    //ArrayBuffer
    console.log("-------------------------13---------------------------");
    let ab = obj.ArrayBuffer;
    let u8a1 = new Uint8Array(ab);
    for (var i = 0; i < u8a1.length; i++) {
        console.log(i, u8a1[i]);
    }
    obj.ArrayBufferTest(ab);
    obj.ArrayBufferTest(new Uint8Array(ab));
    let ab2 = obj.ArrayBufferTest(new Uint8Array(ab, 5));
    let u8a2 = new Uint8Array(ab2);
    console.log(u8a2.length);
    for (var i = 0; i < u8a2.length; i++) {
        console.log(i, u8a2[i]);
    }
    
    //引擎方法
    console.log("--------------------------14--------------------------");
    //在FJsEnv启动，调用Start时传入的参数可以通过argv获取
    let world = (argv.getByName("GameInstance") as UE.GameInstance).GetWorld();
    let actor = world.SpawnActor(UE.MainActor.StaticClass(), undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined) as UE.MainActor;
    console.log(actor.GetName());
    console.log(actor.K2_GetActorLocation().ToString());
    
    //蓝图加载
    let bpClass = UE.Class.Load('/Game/StarterContent/TestBlueprint.TestBlueprint_C')
    let bpActor = world.SpawnActor(bpClass, undefined, UE.ESpawnActorCollisionHandlingMethod.Undefined, undefined, undefined) as UE.Game.StarterContent.TestBlueprint.TestBlueprint_C;
    bpActor.Foo(false, 8000, 9000);
    
    //蓝图结构体加载
    let TestStruct = UE.UserDefinedStruct.Load("UserDefinedStruct'/Game/StarterContent/TestStruct.TestStruct'");
    let testStruct = UE.NewStruct(TestStruct) as UE.Game.StarterContent.TestStruct.TestStruct;
    testStruct.age = 10;
    testStruct.speed = 5;
    bpActor.Bar(testStruct);
    
    //蓝图枚举
    console.log("-------------------------15---------------------------");
    console.log(UE.Game.StarterContent.TestEnum.TestEnum.Blue);
    console.log(UE.Game.StarterContent.TestEnum.TestEnum.Red);
    console.log(UE.Game.StarterContent.TestEnum.TestEnum.Green);
    
    //Delegate
    console.log("--------------------------16--------------------------");
    function MutiCast1(i) {
        console.warn("MutiCast1<<<", i);
    }
    
    function MutiCast2(i) {
        console.warn("MutiCast2>>>", i);
        actor.NotifyWithInt.Remove(MutiCast2);//调用一次后就停掉
    }
    
    actor.NotifyWithInt.Add(MutiCast1)
    actor.NotifyWithInt.Add(MutiCast2)
    
    console.log("NotifyWithString.IsBound", actor.NotifyWithString.IsBound());
    console.log("NotifyWithRefString.IsBound", actor.NotifyWithRefString.IsBound());
    actor.NotifyWithRefString.Bind((strRef) => {
        //console.error("NotifyWithRefString");
        console.log("NotifyWithRefString", $unref(strRef));
        $set(strRef, "out to NotifyWithRefString");//引用参数输出
    });
    console.log("NotifyWithString.IsBound", actor.NotifyWithString.IsBound());
    console.log("NotifyWithRefString.IsBound", actor.NotifyWithRefString.IsBound());
    
    actor.NotifyWithStringRet.Bind((inStr) => {
        return "////" + inStr;
    });
    
    actor.NotifyWithInt.Broadcast(888999);
    let strRef = $ref("666");
    actor.NotifyWithRefString.Execute(strRef);
    console.log("out str:" + $unref(strRef));
    let retStr = actor.NotifyWithStringRet.Execute("console.log('hello world')");
    console.log("ret str:" + retStr);
    console.log("waiting native call script...........");
    
    //Pass JsFunction as Delegate
    function IsJohn(str:string) : boolean {
        return str == "John";
    }
    obj.PassJsFunctionAsDelegate(toManualReleaseDelegate(IsJohn));
    //release after using
    releaseManualReleaseDelegate(IsJohn);
    
    //unhandledRejection
    on('unhandledRejection', function(reason: any) {
        console.log('unhandledRejection~~~', reason.stack);
    });
    
    new Promise(()=>{
        throw new Error('unhandled rejection');
    });

    console.log("QuickStartMain_Part_Orig leave");
}

async function QuickStartMain() {
    console.log("QuickStartMain enter");

    await QuickStartMain_Part_InitialSleep();

    // await QuickStartMain_Part_TextEncoding();

    // await QuickStartMain_Part_UEWebsocket();

    // await QuickStartMain_Part_Stompjs();

    await QuickStartMain_Part_StompController();

    // await QuickStartMain_Part_Orig();

    console.log("QuickStartMain leave");
}

QuickStartMain();
