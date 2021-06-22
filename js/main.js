var WDSlider = function(slideContainer){
  this.isPressed = false;
  this.startX = 0;
  this.lastX = 0;
  this.movedPercent = 0;
  this.sliderContainer = slideContainer;

  this.createDots = function (slider) {
    var dotContainer = slider.querySelector('.WD-dots');
    dotContainer.addEventListener('click', this.dotClickHandler.bind(this));

    var slides = slider.querySelectorAll('.WD-slider-component');
    slides.forEach(function (_, i) {
        dotContainer.insertAdjacentHTML(
            'beforeend',
            `<button class="WD-dot" data-slide="${i}"></button>`
        );
    });
  };


  this.createSlideNavButtons = function (slider) {
      slider.insertAdjacentHTML(
          'beforeend',
          "<button class='WD-slider-btn WD-slider-btn-left'>&larr;</button>"
      );
      slider.insertAdjacentHTML(
        'beforeend',
        `<button class="WD-slider-btn WD-slider-btn-right">&rarr;</button>`
    );
    var LeftButton = slider.querySelector('.WD-slider-btn-left');
    var RightButton = slider.querySelector('.WD-slider-btn-right');

    RightButton.addEventListener('click', this.nextSlide.bind(this));
    LeftButton.addEventListener('click', this.prevSlide.bind(this));
  };


  this.dotClickHandler = function (e) {
    if (e.target.classList.contains('WD-dot')) {
      var slide = e.target.dataset.slide;
      //console.log("dot click handler", slide)
      this.goToSlide(slide,e.target);
      this.activateDot(slide,e.target);
      this.updateCurSlideState(slide,e);
    }
  };

  this.updateCurSlideState = function(SlideCount,evt){
    evt.target.closest(".WD-slider-container").dataset.curSlide = SlideCount;
  };

  this.slideMouseDownHandler = function(evt){
      evt.preventDefault();

      var selectedSlideContainer_Slides = evt.currentTarget.querySelectorAll(".WD-slider-component");
      selectedSlideContainer_Slides.forEach(function(slide){
          console.log(slide.contains(evt.target));
      })

      if(evt.target.classList.contains("WD-slider-btn") || 
      evt.target.classList.contains("WD-dot") || 
      evt.target.classList.contains("WD-dots")) return;

      this.isPressed = true
      this.startX = evt.offsetX;
  };

  this.slideMouseMoveHandler = function(evt){
      evt.preventDefault();
      if(!this.isPressed) return;
      
      this.lastX = evt.offsetX;

      var width = parseInt(window.getComputedStyle(evt.currentTarget).width.replace("px",""))
      
      this.movedPercent = ( (this.startX - this.lastX) * 100 / width ) 
      var selectedSlideContainer_Slides = evt.currentTarget.querySelectorAll(".WD-slider-component");
      selectedSlideContainer_Slides.forEach(function(s, i) {
          var style = window.getComputedStyle(s);
          var matrix = parseInt(style.transform.split(",")[4].trim());
          //s.style.transform = `translateX(${( (100 * (i - 0)) - movedPercent) }%)`
          s.style.transform = `translateX(${( (100 * (matrix/width))   - this.movedPercent) }%)`
      },this);
  };

  this.slideMouseUpHandler = function(evt){
      if(!this.isPressed) return;
      
      if(evt.target.classList.contains("WD-slider-btn") || 
      evt.target.classList.contains("WD-dot") || 
      evt.target.classList.contains("WD-dots")) return;
      
      if(this.movedPercent > 5){
        this.nextSlide(evt);
      }
      else if(this.movedPercent < -5){
        this.prevSlide(evt);
      }
      else{
        this.goToSlide(this.sliderContainer.dataset.curSlide,evt.currentTarget)
      }
      this.movedPercent = 0;
      this.isPressed = false;
  }

  this.activateDot = function (slide,sliderContainerId) {
    var slider = sliderContainerId.closest(".WD-slider-container")
    if(typeof slider != undefined){
      slider.querySelectorAll('.WD-dot').forEach(function(dot){
          dot.classList.remove('WD-dots-active')
      });
      slider.querySelector(`.WD-dot[data-slide="${slide}"]`).classList.add('WD-dots-active');
    }
  };

  this.goToSlide = function (slide,sliderContainerId) {
    
    var slides = sliderContainerId.closest(".WD-slider-container").querySelectorAll(".WD-slider-component")
    slides.forEach(function(s, i){
        s.style.transform = `translateX(${100 * (i - slide)}%)`
    });
  };

// Next slide
  this.nextSlide = function (evt) {
    
      var selectedSlideContainer_CurSlide = parseInt(evt.target.closest(".WD-slider-container").dataset.curSlide);
      if (selectedSlideContainer_CurSlide === evt.target.closest(".WD-slider-container").querySelectorAll(".WD-slider-component").length - 1) {
        selectedSlideContainer_CurSlide = 0;
      } 
      else {
        selectedSlideContainer_CurSlide += 1;
      }
      this.goToSlide(selectedSlideContainer_CurSlide,evt.target);
      this.activateDot(selectedSlideContainer_CurSlide,evt.target);
      this.updateCurSlideState(selectedSlideContainer_CurSlide,evt);
  };

  this.prevSlide = function (evt) {
      var selectedSlideContainer_CurSlide = parseInt(evt.target.closest(".WD-slider-container").dataset.curSlide);
      if (selectedSlideContainer_CurSlide === 0) {
        selectedSlideContainer_CurSlide = evt.target.closest(".WD-slider-container").querySelectorAll(".WD-slider-component").length - 1;
      } else {
        selectedSlideContainer_CurSlide -= 1;
      }
      this.goToSlide(selectedSlideContainer_CurSlide,evt.target);
      this.activateDot(selectedSlideContainer_CurSlide,evt.target);
      this.updateCurSlideState(selectedSlideContainer_CurSlide,evt);
  };

   WDSlider.prototype.init = function () {
     
    var curSlide = 0;
    if(!this.sliderContainer.classList.contains("WD-slider-container")) return;

    this.sliderContainer.dataset.curSlide = curSlide;

    this.sliderContainer.addEventListener("mousedown", this.slideMouseDownHandler.bind(this));
    this.sliderContainer.addEventListener("mousemove", this.slideMouseMoveHandler.bind(this));
    this.sliderContainer.addEventListener("mouseup", this.slideMouseUpHandler.bind(this));
    this.sliderContainer.addEventListener("mouseleave", this.slideMouseUpHandler.bind(this));

    this.goToSlide(curSlide,this.sliderContainer);

    this.createSlideNavButtons(this.sliderContainer);

    this.createDots(this.sliderContainer);
    //activateDot = activateDot.bind(this)
    this.activateDot(curSlide,this.sliderContainer)

  };

};

window.addEventListener("DOMContentLoaded",function(evt){
  var WDSliderObj;

  document.querySelectorAll(".WD-slider-container").forEach(function(slideContainer){
    WDSliderObj = new WDSlider(slideContainer);
    WDSliderObj.init();
  });
});
