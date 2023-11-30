## 下载

<https://gw.w3ipfs.org.cn/ipfs/QmaMF7f5EKgVvhPgrseRZ9X3EmEp6YsjaefkJkRcqzUFAL?filename=JX3Toy.zip>

<https://099eqs.gw1.baitech-ipfs.net/ipfs/QmaMF7f5EKgVvhPgrseRZ9X3EmEp6YsjaefkJkRcqzUFAL?filename=JX3Toy.zip>

<https://crustipfs.info/ipfs/QmaMF7f5EKgVvhPgrseRZ9X3EmEp6YsjaefkJkRcqzUFAL?filename=JX3Toy.zip>

<https://crustipfs.tech/ipfs/QmaMF7f5EKgVvhPgrseRZ9X3EmEp6YsjaefkJkRcqzUFAL?filename=JX3Toy.zip>

<https://jx3toy.4everland.store/JX3Toy.zip>

<https://crustipfs.world/ipfs/QmaMF7f5EKgVvhPgrseRZ9X3EmEp6YsjaefkJkRcqzUFAL?filename=JX3Toy.zip>

<https://crustipfs.mobi/ipfs/QmaMF7f5EKgVvhPgrseRZ9X3EmEp6YsjaefkJkRcqzUFAL?filename=JX3Toy.zip>

<https://crustipfs.online/ipfs/QmaMF7f5EKgVvhPgrseRZ9X3EmEp6YsjaefkJkRcqzUFAL?filename=JX3Toy.zip>

<https://crust.fans/ipfs/QmaMF7f5EKgVvhPgrseRZ9X3EmEp6YsjaefkJkRcqzUFAL?filename=JX3Toy.zip>

<https://crustgateway.online/ipfs/QmaMF7f5EKgVvhPgrseRZ9X3EmEp6YsjaefkJkRcqzUFAL?filename=JX3Toy.zip>

<https://cdn.jsdelivr.net/gh/JX3Toy/JX3Toy@main/JX3Toy.zip>

<https://fastly.jsdelivr.net/gh/JX3Toy/JX3Toy@main/JX3Toy.zip>

## 安装
绿色软件无需安装，解压缩到任意位置即可。如果杀毒软件误报，请自行设置排除相关文件夹。  
解压缩后运行更新程序 `Updater.exe`，会自动下载和更新组件并启动。

## 使用
在进入游戏之前启动软件（登陆或选择角色界面）。  
如果已经进入游戏才启动，设置的快捷键不生效，返回角色重新进游戏即可（无需重新启动）。  
插件载入完成后启动程序会自动退出。  
如果开启了多个游戏窗口，等待启动完成后再启动下一个。  

### 菜单功能
进入游戏后， 点击角色头像下方小箭头或屏幕右侧小扳手。

- 全局设置
  - 主播模式（开启后不显示所有提示信息）
  - 自动面向（使用技能时如果面向不正确自动面向目标， PVE建议关闭）
  - 拾取碎银（开启后，自动拾取自己周围的碎银）
  - 自动QTE（开启后，类似龙门飞剑之类的QTE会自动完成）
- 技能开关（勾选的技能，宏不会释放）
- 门派宏（当前门派对应的宏列表，点击列表项载入宏）
- 通用宏（对应宏目录下的通用）
- 宏选项（载入宏之后，如果宏内定义了选项，会在这显示）
- 调试信息
  - 记录技能释放（开启后，宏内使用技能时会输出记录信息）
  - 自己buff（输出自己buff信息）
  - 目标buff（输出目标buff信息）
  - 附近NPC（输出附近所有NPC信息）
  - 自己位置（输出自己当前所在地图和位置坐标）
- 自动科举，自动攻防答题等功能请自行探索

### 快捷键设置
点击游戏主菜单的快捷键设置，找到相应条目设置快捷键。

### 如何编写宏
宏是一个Lua脚本文件，可以使用记事本或任意文本编辑器进行编写。最好找一款支持Lua语法高亮的编辑器，如 Notepad++、VSCode（安装Lua插件）、EditPlus（安装Lua插件）。

!> 请留意宏文件保存时的编码，保存为ANSI编码，没有这个编码选项的编辑器保存为GBK、GB18030等简体中文编码。（国际服保存为UTF-8编码）

编写好的宏放在软件 **Macro** 文件夹下 **对应门派** 的文件夹中。

宏里面定义一系列函数，函数中调用预定义的宏命令实现宏的执行逻辑，运行的时候这些函数会被系统调用。

最基本的是Main函数，每秒调用十几次，下面是一个简单示例。
```lua
--如果宏是运行状态, 这个函数每秒被调用十几次。
function Main()
  bigtext("Hello World.")
end
```

## 联系和反馈
如果发现Bug或有建议请通过以下方式反馈:

Keybase: <https://keybase.io/jx3toy>

社区: <https://jx3toy.zulipchat.com>

Email: <JX3Toy@proton.me>
