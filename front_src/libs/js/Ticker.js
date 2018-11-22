/* eslint-disable */



Ticker = function(){


    this.curr_id = 0; // id текущего листенера
    this.listeners = []; // массив листенеров
    this.framestep = 1; // 60 по умолчанию
    this.counter = 0; // счётчик кадров
    this.timeout_id = 0; // id таймаутов
    this.interval_id = 0; // id интервалов




    this.real_fps = 60/this.framestep; // реальный fps (высчитывается)
    // this.fps_meter_delay = 1000/4; // пауза между расчётами реального fps
    this.fps_meter_delay = 1000/12; // пауза между расчётами реального fps




    this.globalPause = false; // глобальная пауза

    self = this;



    //
    // основная функция тика
    //
    var time;
    var tick_multiplied = 0;
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    this.startTime = new Date().getTime();
    this.tick = function(){
        if(this.globalPause==true){ // global pause
            requestAnimationFrame(function(){
                self.tick();
            });
            return;
        }
        if(tick_multiplied < this.framestep-1){
            tick_multiplied++;
        } else {
            for(var i=0; i<this.listeners.length; i++){
                if(this.listeners[i].pause==false){
                    this.listeners[i].clbck();
                }
            }
            tick_multiplied = 0;
            this.counter++;
        }

        requestAnimationFrame(function(){
            self.tick();
        });
    };
    //
    //


    // добавление листенера
    this.addListener = function(clbck){
        var listener = {};
        listener.clbck = clbck;
        listener.id = ++this.curr_id;
        listener.pause = false;

        this.listeners.push(listener);

        return listener;
    };

    // убираем листенер
    this.removeListener = function(listener){

        for(var i=0; i<this.listeners.length; i++){
            if(listener.id === this.listeners[i].id){
                this.listeners.splice(i, 1);
            }
        }
    };




    // создание таймаута
    this.timeout = function(clbck, delay, frames){ // delay — задержка (в мс или кадрах), frames - опционально, указывает что считаем задержку в кадрах (true)
        var timeout = {};
        timeout.timestart = this.counter;
        if(frames!=undefined){
            timeout.frames = true;
        }else {
            timeout.frames = false;
        }
        timeout.id = ++this.timeout_id;
        timeout.delay = delay;
        timeout.clbck = clbck;

        if(timeout.frames==true){
            timeout.listener = this.addListener(function(){
                if(Ticker.counter >= timeout.timestart + timeout.delay){
                    timeout.clbck();
                    Ticker.removeListener(this);
                }
            });
        }else {
            timeout.delay_fr = timeout.delay*60/(1000*this.framestep);
            timeout.listener = this.addListener(function(){
                if(Ticker.counter >= timeout.timestart + timeout.delay_fr){
                    timeout.clbck();
                    Ticker.removeListener(this);
                }
            });
        }

        return timeout;
    };
    // удаляем таймаут
    this.clearListenerTimeout = function(timeout){
        Ticker.removeListener(timeout.listener);
    };




    this.interval = function(clbck, delay, frames){ // delay — задержка (в мс или кадрах), frames - опционально, указывает что считаем задержку в кадрах (true)
        var interval = {};
        interval.timestart = this.counter;
        if(frames!=undefined){
            interval.frames = true;
        }else {
            interval.frames = false;
        }
        interval.id = ++this.interval_id;
        interval.delay = delay;
        interval.clbck = clbck;


        if(interval.frames==true){
            interval.listener = this.addListener(function(){
                if(Ticker.counter >= interval.timestart + interval.delay){
                    interval.clbck();
                    interval.timestart = interval.timestart + interval.delay;
                }
            });
        }else {
            interval.delay_fr = interval.delay*60/(1000*this.framestep);
            interval.listener = this.addListener(function(){
                if(Ticker.counter >= interval.timestart + interval.delay_fr){
                    interval.clbck();
                    interval.timestart = interval.timestart + interval.delay_fr;
                }
            });
        }

        return interval;
    };
    // удаляем интервал
    this.intervalClear = function(interval){
        Ticker.removeListener(interval.listener);
    };

    // this.fpsMet = false;

    

    //узнаём реальный fps

    // setTimeout(() => {
    //     this.fpsMet = document.querySelector('#innerFps');
    // }, 3000);
    // var self = this;
    // var fps_ticks = 0;
    // var fps_time = new Date().getTime();
    // this.getRealFPS = function(){
    //     var ticks = self.counter - fps_ticks;
    //     var d_t = (new Date().getTime()) - fps_time;
    //     this.real_fps = Math.round(10*ticks/(d_t/1000))/10;
    //     if (this.fpsMet) this.fpsMet.style.transform = `scaleX(${this.real_fps/60})`;
    //     fps_ticks = self.counter;
    //     fps_time = new Date().getTime();
    // };
    // var start_ticks = 0;
    // this.interval(function(){
    //     self.getRealFPS();
    // }, this.fps_meter_delay);





    // this.tick();
    requestAnimationFrame(function () {
      self.tick();
    });
    return this;

}();

module.exports = Ticker;
