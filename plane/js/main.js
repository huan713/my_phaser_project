var game = new Phaser.Game(240, 400, Phaser.CANVAS, 'game')

// 创建游戏场景
game.MyStates = {}
// 初始化游戏场景 -- 初始
game.MyStates.root = {
    preload: function () {
        game.load.image('preload', 'assets/preloader.gif')
        // 游戏适配
        if (!game.device.desktop) {
            game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT
        }
    },
    create: function () {
        game.state.start('load')
    }
}
// 初始化游戏场景 -- 加载
game.MyStates.load = {
    preload: function () {
        // 设置加载进度
        var preloadSprite = game.add.sprite(game.width / 2 - 110, game.height / 2 - 9.5, 'preload');
        game.load.setPreloadSprite(preloadSprite);
        // 加载资源
        game.load.image('background', 'assets/bg.jpg');
        game.load.image('copyright', 'assets/copyright.png');
        game.load.spritesheet('myplane', 'assets/myplane.png', 40, 40, 4);
        game.load.spritesheet('startbutton', 'assets/startbutton.png', 100, 40, 2);
        game.load.spritesheet('replaybutton', 'assets/replaybutton.png', 80, 30, 2);
        game.load.spritesheet('sharebutton', 'assets/sharebutton.png', 80, 30, 2);
        game.load.image('mybullet', 'assets/mybullet.png');
        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('enemy1', 'assets/enemy1.png');
        game.load.image('enemy2', 'assets/enemy2.png');
        game.load.image('enemy3', 'assets/enemy3.png');
        game.load.spritesheet('explode1', 'assets/explode1.png', 20, 20, 3);
        game.load.spritesheet('explode2', 'assets/explode2.png', 30, 30, 3);
        game.load.spritesheet('explode3', 'assets/explode3.png', 50, 50, 3);
        game.load.spritesheet('myexplode', 'assets/myexplode.png', 40, 40, 3);
        game.load.image('award', 'assets/award.png');
        game.load.audio('normalback', 'assets/normalback.mp3');
        game.load.audio('playback', 'assets/playback.mp3');
        game.load.audio('fashe', 'assets/fashe.mp3');
        game.load.audio('crash1', 'assets/crash1.mp3');
        game.load.audio('crash2', 'assets/crash2.mp3');
        game.load.audio('crash3', 'assets/crash3.mp3');
        game.load.audio('ao', 'assets/ao.mp3');
        game.load.audio('pi', 'assets/pi.mp3');
        game.load.audio('deng', 'assets/deng.mp3');
        // 加载进度
        game.load.onFileComplete.add(function () {})
    },
    create: function () {
        game.state.start('play')
    }
}
// 初始化游戏场景 -- 场景
game.MyStates.state = {
    create: function () {
        game.add.sprite(0, 0, 'background')
        game.add.image(12, game.height - 16, 'copyright')
        // 添加飞机和飞机的逐帧动画
        var myplane = game.add.sprite(100, 100, 'myplane')
        myplane.animations.add('fly')
        myplane.animations.play('fly', 12, true)
        // 添加按钮
        game.add.button(70, 300, 'startbutton', this.onStartClick, this, 1, 1, 0)
    },
    onStartClick: function () {
        game.state.start('play')
    }
}
// 初始化游戏场景 -- 游戏
game.MyStates.play = {
    create: function () {
        // 开启系统的物理引擎
        game.physics.startSystem(Phaser.Physics.ARCADE)
        // 添加背景和背景的自动播放
        var bg = game.add.tileSprite(0, 0, game.width, game.height, 'background')
        bg.autoScroll(0, 20)
        this.myplane = game.add.sprite(100, 100, 'myplane')
        this.myplane.animations.add('fly')
        this.myplane.animations.play('fly', 12, true)
        // 飞机的物理引擎
        game.physics.arcade.enable(this.myplane)
        // 飞机的边缘碰撞
        this.myplane.body.collideWorldBounds = true
        this.enemy = game.add.sprite(100, 10, 'enemy1')
        game.physics.arcade.enable(this.enemy)
        // 飞机的渐变动画
        var tween = game.add.tween(this.myplane).to({y: game.height - 40}, 1000, null, true)
        // 渐变动画的回调
        tween.onComplete.add(this.onStart, this)
    },
    update: function () {
        var now = new Date().getTime()
        // 飞机开始射击并且射击的子弹间隔超过一定时间的时候
        if (this.myplane.myStartFire && now - this.lastBulletTime > 500) {
            var myBullet = game.add.sprite(this.myplane.x + 15, this.myplane.y -8, 'mybullet')
            // 子弹的物理引擎
            game.physics.enable(myBullet, Phaser.Physics.ARCADE)
            // 子弹的速度
            myBullet.body.velocity.y = -200
            this.lastBulletTime = now
            this.myBullets.add(myBullet)
        }
        // 飞机和子弹的碰撞检测
        game.physics.arcade.overlap(this.myBullets, this.enemy, this.collisionHandler, null, this)
    },
    collisionHandler: function (myBullet, enemy) {
        myBullet.kill()
        enemy.kill()
    },
    onStart: function () {
        // 飞机的可拖拽
        this.myplane.inputEnabled = true
        this.myplane.input.enableDrag()
        this.myplane.myStartFire = true
        this.lastBulletTime = 0
        // 创建子弹组
        this.myBullets = game.add.group()
        this.myBullets.enableBody = true
        // 添加分数文字
        var style = {font: "16px Arial", fill: "#ff0000"}
        var text = game.add.text(0, 0, 'Score: 0', style)
    }
}

// 添加游戏场景
game.state.add('root', game.MyStates.root);
game.state.add('load', game.MyStates.load);
game.state.add('state', game.MyStates.state);
game.state.add('play', game.MyStates.play);
// 启动游戏场景
game.state.start('root')