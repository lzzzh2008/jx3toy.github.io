const Contracts = {
	ERC20: {
		Address: '0xf5675b45C309676D84A8fE885fFAefe51EDEBE87',
		ABI:[
			'function balanceOf(address) view returns (uint256)',
			'function allowance(address, address) view returns (uint256)',
			'function approve(address, uint256) returns (bool)',
			'function getFree()',
		]
	},
	TOY: {
		Address: '0x9694f0babc31E956d320Da6811A4E9e2D97781c4',
		ABI: [
			'function isUser(address) view returns (bool)',
			'function canReg() view returns (bool)',
			'function register(bytes32)',
			'function getExpire() view returns (uint256)',
			'function getPrice() view returns (uint256)',
			'function recharge(uint256)',
			'function getDeviceID() view returns (bytes32)',
			'function changeDevice(bytes32)',
		]
	}
}

const g_nGasLimit = 200000
const g_nGasPrice = ethers.utils.parseUnits("100", "gwei")

const getContract = (name) => {
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const signer = provider.getSigner()
	return new ethers.Contract(Contracts[name].Address, Contracts[name].ABI, signer)
}

const showDialog = (title, text) => {
    const dialog = new bootstrap.Modal(dlg_Dialog)
    dlg_Title.innerText = '等待' + title + '完成'
    dlg_Spinner.hidden = false
    dlg_Text.innerText = text
    dlg_Text.className = 'text-primary'
    dialog.show()
}

const finishDialog = (title, error) => {
    dlg_Title.innerText = '完成'
    dlg_Spinner.hidden = true
    if (error) {
        dlg_Text.innerText = title + '失败: ' + error
        dlg_Text.className = 'text-danger'
    } else {
        dlg_Text.innerText = title + '成功'
        dlg_Text.className = 'text-success'
    }
}

const messageBox = (text) => {
    const dialog = new bootstrap.Modal(msg_Dialog)
    msg_Text.innerText = text
    dialog.show()
}

const setButtons = (bDisabled) => {
	btn_Register.disabled = bDisabled
	btn_getExpire.disabled = bDisabled
	btn_Recharge.disabled = bDisabled
	btn_getDeviceID.disabled = bDisabled
	btn_ChangeDevice.disabled = bDisabled
	btn_addAsset.disabled = bDisabled
	btn_GetUSDT.disabled = bDisabled
}

const doConnect = async () => {
	if (!window.ethereum) {
		messageBox('尚未安装MetaMask钱包')
		return
	}

	if (!await ethereum._metamask.isUnlocked()) {
		messageBox('MetaMask钱包未解锁')
		return
	}

	let chainId = await ethereum.request({ method: 'eth_chainId' })
	if (chainId != '0x13881') {
		await ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x13881', chainName: 'polygon测试网', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, rpcUrls: ['https://rpc-mumbai.maticvigil.com'], blockExplorerUrls: ['https://mumbai.polygonscan.com/'] }]})
	}
	chainId = await ethereum.request({ method: 'eth_chainId' })
	if (chainId != '0x13881') {
		messageBox('添加或切换到 polygon 测试网 失败')
		return
	}

	try {
		const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
		if (accounts.length > 0) {
			text_Address.innerText = accounts[0]
			setButtons(false)
		}
		else {
			messageBox('MetaMask钱包尚未创建账号')
			return
		}
	} catch (error) {
		messageBox('请在MetaMask钱包中处理请求')
		console.log(error)
		return
	}

	ethereum.on('accountsChanged', (accounts) => {
		if (accounts.length > 0) {
			text_Address.innerText = accounts[0]
		}
		else {
			text_Address.innerText = '未连接'
		}
	})
}

btn_ConnectMask.onclick = async () => {
	btn_ConnectMask.disabled = true
	spin_ConnectMask.hidden = false
	await doConnect()
	btn_ConnectMask.disabled = false
	spin_ConnectMask.hidden = true
}

const doRegister = async () => {
	if (input_Register.value.length != 64) {
		messageBox('设备ID不正确, 请从软件登录界面中复制后粘贴')
		return
	}
	const toy_Contract = getContract('TOY')
	let can = await toy_Contract.canReg()
	if (!can) {
		messageBox('注册功能暂未开放')
		return
	}
	let isUser = await toy_Contract.isUser(ethereum.selectedAddress)
	if (isUser) {
		messageBox('当前账号已注册过，请勿重复注册')
		return
	}

	showDialog('注册', '请在MetaMask钱包确认后耐心等待...')
	const deviceID = '0x' + input_Register.value
	let errMsg
	try {
		let tx = await toy_Contract.register(deviceID, { gasLimit: g_nGasLimit, gasPrice: g_nGasPrice })
		await tx.wait()
	} catch (error) {
		errMsg = error.code
	}
	finishDialog('注册', errMsg)
}

btn_Register.onclick = async () => {
	btn_Register.disabled = true
	spin_Register.hidden = false
	await doRegister()
	spin_Register.hidden = true
	btn_Register.disabled = false
}

btn_getExpire.onclick = async () => {
	btn_getExpire.disabled = true
	spin_getExpire.hidden = false
	const toy_Contract = getContract('TOY')
	let isUser = await toy_Contract.isUser(ethereum.selectedAddress)
	if (isUser) {
		let expireTime = await toy_Contract.getExpire()
		text_ExpireTime.innerText = new Date(expireTime * 1000).toLocaleString()
	}
	else {
		messageBox('当前账号尚未注册')
	}
	btn_getExpire.disabled = false
	spin_getExpire.hidden = true
}

//充值
const doRecharge = async () => {
	let months = parseInt(input_Months.value)
	if (months < 1 || months > 1000) {
		messageBox('月数需要输入1-1000之间的数值')
		return
	}

	const toy_Contract = getContract('TOY')
	const erc20_Contract = getContract('ERC20')
	let isUser = await toy_Contract.isUser(ethereum.selectedAddress)
	if (!isUser) {
		messageBox('当前账号尚未注册')
		return
	}

	let price = await toy_Contract.getPrice()
	let total = price * months
	let balance = await erc20_Contract.balanceOf(ethereum.selectedAddress)
	let szToken = 'USDT'
	if (balance < total) {
		messageBox('余额不足, 月卡价格 ' + price / 1000000 + szToken + ', 充值 ' + months + ' 个月, 需要 ' + total / 1000000 + szToken + ', 当前余额 ' + balance / 1000000 + szToken)
		return
	}

	showDialog('充值', ' 在MetaMask钱包授权扣款额度时, 在交易详情中仔细确认合约地址和批准金额, 可能需要两次确认交易')
	let errMsg
	try {
		let allowance = await erc20_Contract.allowance(ethereum.selectedAddress, toy_Contract.address)
		if (allowance < total) {
			let tx1 = await erc20_Contract.approve(toy_Contract.address, total, { gasLimit: g_nGasLimit, gasPrice: g_nGasPrice })
			await tx1.wait()
		}
		let tx2 = await toy_Contract.recharge(months, { gasLimit: g_nGasLimit, gasPrice: g_nGasPrice })
		await tx2.wait()

	} catch (error) {
		errMsg = error.code
	}
	finishDialog('充值', errMsg)
}

btn_Recharge.onclick = async () => {
	btn_Recharge.disabled = true
	spin_Recharger.hidden = false
	await doRecharge()
	btn_Recharge.disabled = false
	spin_Recharger.hidden = true
}

btn_getDeviceID.onclick = async () => {
	btn_getDeviceID.disabled = true
	spin_getDeviceID.hidden = false
	const toy_Contract = getContract('TOY')
	let isUser = await toy_Contract.isUser(ethereum.selectedAddress)
	if (isUser) {
		let deviceID = await toy_Contract.getDeviceID()
		text_DeviceID.innerText = deviceID.substr(2).toUpperCase()
	}
	else {
		messageBox('当前账号尚未注册')
	}
	btn_getDeviceID.disabled = false
	spin_getDeviceID.hidden = true
}

const doChangeDevice = async () => {
	let newDeviceID = input_ChangeDevice.value.trim()
	if (newDeviceID.length != 64) {
		messageBox('新设备ID不正确, 请从软件登录界面中复制后粘贴')
		return
	}
	
	const toy_Contract = getContract('TOY')
	let isUser = await toy_Contract.isUser(ethereum.selectedAddress)
	if (!isUser) {
		messageBox('当前账号尚未注册')
		return
	}
	
	let deviceID = await toy_Contract.getDeviceID()
	if (deviceID.substr(2).toUpperCase() == newDeviceID) {
		messageBox('输入的新设备ID和当前绑定设备ID相同, 无需换绑')
		return
	}
	newDeviceID = '0x' + newDeviceID

	showDialog('换绑', '请在MetaMask钱包确认后耐心等待...')
	let errMsg
	try {
		let tx = await toy_Contract.changeDevice(newDeviceID, { gasLimit: g_nGasLimit, gasPrice: g_nGasPrice })
		await tx.wait()
	} catch (error) {
		errMsg = error.code
	}
	finishDialog('换绑', errMsg)
}

btn_ChangeDevice.onclick = async () => {
	btn_ChangeDevice.disabled = true
	spin_ChangeDevice.hidden = false
	await doChangeDevice()
	btn_ChangeDevice.disabled = false
	spin_ChangeDevice.hidden = true
}

btn_addAsset.onclick = async () => {
	await ethereum.request({ method: 'wallet_watchAsset', params: { type: 'ERC20', options: { address: Contracts.ERC20.Address, symbol: 'USDT', decimals: 6 }}})
}

btn_GetUSDT.onclick = async () => {
	btn_GetUSDT.disabled = true
	spin_GetUSDT.hidden = false
	const erc20_Contract = getContract('ERC20')
	try {
		let tx = await erc20_Contract.getFree({ gasLimit: g_nGasLimit, gasPrice: g_nGasPrice });
		await tx.wait();
		messageBox('领取成功')
	} catch (error) {
		messageBox('领取失败, 只能领取一次, 错误代码: ' + error.code)
	}
	btn_GetUSDT.disabled = false
	spin_GetUSDT.hidden = true
}

/*
btn_Test.onclick = async () => {
}
*/
