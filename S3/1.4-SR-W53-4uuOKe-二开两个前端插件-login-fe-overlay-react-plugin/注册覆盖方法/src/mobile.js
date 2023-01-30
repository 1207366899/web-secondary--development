/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import {
    Popup,
    Toast,
    Form,
    Button,
    Input,
    Picker,
    Selector,
    Checkbox,
    Space,
} from 'antd-mobile-v5';
import background from './images/background.png';
import compute from './images/compute.png';
import errorCode from './ERROR_zh_CN.json'
import { queryAllMsg, userMsgInsert, createAccount } from './api/asset';
import './app.less';

const functionList = [
    [
        { label: '董事长/CEO/CIO', value: '1' },
        { label: 'CTO/研发总监/架构/产品', value: '2' },
        { label: '市场/销售/售前/运营', value: '3' },
        { label: '软件开发/数据开发', value: '4' },
        { label: '项目经理/测试/实施/运维', value: '5' },
        { label: '业务人员', value: '6' },
        { label: '其他', value: '99' },
    ],
];
const tradeList = [
    [
        { label: '城市/应急/政务', value: '1' },
        { label: '工业/能源/电力', value: '2' },
        { label: '园区/物流/交通', value: '3' },
        { label: '水利/水务/环保', value: '4' },
        { label: '医疗/卫生/教育', value: '5' },
        { label: '公安/军工/金融', value: '6' },
        { label: '其他', value: '99' },
    ],
];

let registerName = '';
// let resolveFunc = () => {};
// let loginData = {};

const App = props => {
    const [form] = Form.useForm();

    console.log(111, props);
    const { bindSubmit } = props;
    const [show, setShow] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [userName, setUserName] = useState('');
    const [channelList, setChannelList] = useState([]);
    const [scenariosList, setScenariosList] = useState([]);
    const [functionVisible, setFunctionVisible] = useState(false);
    const [showFunctionVal, setShowFunctionVal] = useState();
    const [tradeCodeVisible, setTradeCodeVisible] = useState(false);
    const [showTradeCode, setShowTradeCode] = useState();
    const [channelCodeVisible, setChannelCodeVisible] = useState(false);
    const [showChannelCode, setShowChannelCode] = useState();

    useEffect(() => {
        bindSubmit(bindOnSubmit);
    }, []);

    const getShowInfo = async () => {
        const { data } = await queryAllMsg();
        const { channelList, scenariosList } = data;
        let channelListNew = channelList.map(item => {
            return {
                label: item.name,
                value: item.id,
            };
        });
        let scenariosListNew = scenariosList.map(item => {
            return {
                label: item.name,
                value: item.id,
            };
        });
        setChannelList([channelListNew]);
        setScenariosList(scenariosListNew);
        setShowInfo(true);
    };

    // eslint-disable-next-line no-unused-vars
    const bindOnSubmit = async (params, { history }, afterGetToken) => {
        let {
            id,
            loginName,
            password,
            channel,
            recommend_code,
            registerType,
            captcha,
            codeImage,
            imageCode,
        } = params;
        // setNewLoginName(loginName);
        registerName = loginName;
        return new Promise(resolve => {
            let registerForm = {
                id,
                loginName,
                password: props.Encrypt(password),
                channel,
                recommend_code,
                register_type: registerType,
            };
            // resolveFunc = resolve;
            createAccount(registerForm, captcha, codeImage, imageCode)
                .then(res => {
                    // const login = {
                    //   success: true,
                    //   token: res.data,
                    // };
                    // loginData = login;
                    // 判断是否是有留资页面
                    // todo从接口判断是否需要进入留资页面
                    if (res.orchResult && res.orchResult?.needMessage) {
                        getShowInfo();
                    } else {
                        loginAfter();
                    }
                })
                .catch(err => {
                    console.log(909090, err);
                    Toast.show({
                        icon: 'fail',
                        content: errorCode[`ERROR.${err.data.code}`] || '注册失败',
                    })
                    resolve({ success: false });
                });
        });
    };

    const loginAfter = () => {
        let newLoginName = registerName;
        console.log(77777, newLoginName);
        let name = newLoginName;
        if (newLoginName.length > 7) {
            name =
                newLoginName.slice(0, 3) +
                '****' +
                newLoginName.slice(7, newLoginName.length);
        } else if (newLoginName.length < 8 && newLoginName.length > 3) {
            let dic = {
                4: '*',
                5: '**',
                6: '***',
                7: '****',
            };
            name = newLoginName.slice(0, 3) + dic[newLoginName.length];
        }
        setUserName(name);
        setShow(true);
    };

    const onFinish = async values => {
        let submitData = { ...values };
        submitData.needHelp = values.needHelp ? 1 : 0;
        submitData.scenariosCode = values.scenariosCode.join(',');
        submitData.phone = registerName;
        console.log(9999, submitData);
        await userMsgInsert(submitData);
        setShowInfo(false);
        loginAfter();
    };

    const cancel = e => {
        e.stopPropagation();
        setShowInfo(false);
        loginAfter();
    };

    return (
        <>
            <Popup
                visible={show}
                onMaskClick={() => {
                    setShow(false);
                }}
                position="top"
                bodyStyle={{ height: '100vh' }}
            >
                <div className="login-mobile-box">
                    <img className="background-images" src={background} alt="" />
                    <div className="compute-images-box">
                        <img className="compute-images" src={compute} alt="" />
                    </div>
                    <div className="login-mobile-title">您已注册成功</div>
                    <div className="login-mobile-account-title">
                        以下是您的试用账户信息
                    </div>
                    <div className="login-mobile-account">{userName}</div>
                    <div className="login-mobile-content">
                        为了保证您的试用体验 请通过电脑访问 <span>s3.smardaten.com</span>
                        并使用您上述注册信息登录 即可开启您的无码化构建应用之旅
                    </div>
                    <div
                        className="login-mobile-btn"
                        onClick={() => {
                            setShow(false);
                            // resolveFunc(loginData);
                        }}
                    >
                        关闭
                    </div>
                </div>
            </Popup>
            <Popup
                visible={showInfo}
                onMaskClick={() => {
                    setShowInfo(false);
                }}
                position="top"
                bodyStyle={{
                    height: '100vh',
                    overflow: 'scroll',
                    padding: '12px',
                    background: '#EEF0F5',
                }}
                className="info-form-login-er"
            >
                <Form
                    form={form}
                    layout="horizontal"
                    onFinish={onFinish}
                    footer={
                        <div className="login-mobile-info-btn">
                            <Button
                                block
                                color="primary"
                                fill="outline"
                                className="cancel"
                                onClick={e => cancel(e)}
                            >
                                取消
                            </Button>
                            <Button
                                block
                                type="submit"
                                color="primary"
                                size="large"
                                className="ensure"
                            >
                                提交
                            </Button>
                        </div>
                    }
                >
                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '姓名不能为空' }]}
                        className="form-item-every"
                    >
                        <Input placeholder="请输入姓名" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                            { required: true },
                            { type: 'string', min: 6 },
                            { type: 'email', warningOnly: true },
                        ]}
                        className="form-item-every"
                    >
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>
                    <Form.Item
                        name="companyName"
                        label="公司名"
                        rules={[{ required: true, message: '公司名不能为空' }]}
                        className="form-item-every"
                    >
                        <Input placeholder="请输入公司名" />
                    </Form.Item>
                    <Form.Item
                        name="functionCode"
                        label="职位"
                        onClick={() => setFunctionVisible(true)}
                        rules={[{ required: true, message: '职位不能为空' }]}
                        className="form-item-every"
                    >
                        <div>
                            <Input
                                placeholder="请选择职位"
                                readOnly
                                value={showFunctionVal}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="tradeCode"
                        label="行业"
                        onClick={() => setTradeCodeVisible(true)}
                        rules={[{ required: true, message: '行业不能为空' }]}
                        className="form-item-every"
                    >
                        <div>
                            <Input
                                placeholder="请选择所在行业"
                                readOnly
                                value={showTradeCode}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="channelCode"
                        label="渠道"
                        onClick={() => setChannelCodeVisible(true)}
                        rules={[{ required: true, message: '渠道不能为空' }]}
                        className="form-item-every"
                    >
                        <div>
                            <Input
                                placeholder="哪个渠道了解到我们"
                                readOnly
                                value={showChannelCode}
                            />
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="scenariosCode"
                        label="应用场景"
                        rules={[{ required: true, message: '应用场景不能为空' }]}
                        className="form-item-every"
                    >
                        <Selector columns={2} multiple options={scenariosList} />
                    </Form.Item>
                    <Form.Item name="needHelp" label="" className="form-item-every">
                        <Checkbox.Group>
                            <Space direction="vertical">
                                <Checkbox value={1}>
                                    需要数睿数据尽快与我联系，详细介绍产品、方案或报价，或提供帮助。
                                </Checkbox>
                            </Space>
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
            </Popup>
            <Picker
                columns={functionList}
                visible={functionVisible}
                onClose={() => {
                    setFunctionVisible(false);
                }}
                onConfirm={(val, data) => {
                    // setValue(v);
                    setShowFunctionVal(data.items[0].label);
                    form.setFieldsValue({ functionCode: val[0] });
                }}
            />
            <Picker
                columns={tradeList}
                visible={tradeCodeVisible}
                onClose={() => {
                    setTradeCodeVisible(false);
                }}
                onConfirm={(val, data) => {
                    setShowTradeCode(data.items[0].label);
                    form.setFieldsValue({ tradeCode: val[0] });
                }}
            />
            <Picker
                columns={channelList}
                visible={channelCodeVisible}
                onClose={() => {
                    setChannelCodeVisible(false);
                }}
                onConfirm={(val, data) => {
                    setShowChannelCode(data.items[0].label);
                    form.setFieldsValue({ channelCode: val[0] });
                }}
            />
        </>
    );
};

export default App;
