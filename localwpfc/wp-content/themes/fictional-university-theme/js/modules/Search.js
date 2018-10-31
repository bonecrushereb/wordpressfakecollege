import $ from 'jquery';

class Search {
  constructor() {
    this.addSearch();
    this.searchResults = $("#search-overlay__results");
    this.openButton = $(".js-search-trigger");
    this.closeButton = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.searchField = $('#search-term');
    this.events();
    this.isOverlayOpen = false;
    this.isSpinnerVisible = false;
    this.prevValue;
    this.typingTimer;
  }

  events() {
    this.openButton.on("click", this.openOverlay.bind(this));
    this.closeButton.on("click", this.closeOverlay.bind(this));
    $(document).on("keydown", this.keyPressDispatcher.bind(this));
    this.searchField.on("keyup", this.typingLogic.bind(this));
  }


  typingLogic() {
    const url = universityData.root_url + '/wp-json/university/v1/search?term=' + this.searchField.val();
    if (this.searchField.val() != this.prevValue) {
      clearTimeout(this.typingTimer);

      if (this.searchField.val()) {
        if (!this.isSpinnerVisible) {
          this.searchResults.html('<div class="spinner-loader"></div>');
          this.isSpinnerVisible = true;
        }
        this.typingTimer = setTimeout(function() {
          $.getJSON(url, (results) => {
            this.searchResults.html(`
              <div class="row">
                <div class="one-third">
                 <h2 class="search-overlay__section-title">General Information</h2>
                    ${results.generalInfo.length ? '<ul class="linked-list min-list">': '<p>No General Information found.</p>'}
                    ${results.generalInfo.map(data => `<li><a href="${data.permalink}">${data.title}</a> 
                    ${data.postType == 'post' ? `by ${data.authorName}` : ''}</li>`).join('')}
                    ${results.generalInfo.length ? '</ul>' : ''}
                </div>
                <div class="one-third">
                  <h2 class="search-overlay__section-title">Programs</h2>
                    ${results.programs.length ? '<ul class="linked-list min-list">': '<p>No Programs found.</p>'}
                    ${results.programs.map(data => `<li><a href="${data.permalink}">${data.title}</a></li>`).join('')}
                    ${results.programs.length ? '</ul>' : ''}
                  <h2 class="search-overlay__section-title">Professors</h2>
                    ${results.generalInfo.length ? '<ul class="linked-list min-list">': '<p>No Professors found.</p>'}
                    ${results.generalInfo.map(data => `<li><a href="${data.permalink}">${data.title}</a> 
                    ${data.postType == 'post' ? `by ${data.authorName}` : ''}</li>`).join('')}
                    ${results.generalInfo.length ? '</ul>' : ''}
                </div>
                <div class="one-third">
                  <h2 class="search-overlay__section-title">Campuses</h2>
                    ${results.campuses.length ? '<ul class="linked-list min-list">': '<p>No Campuses found.</p>'}
                    ${results.campuses.map(data => `<li><a href="${data.permalink}">${data.title}</a></li>`).join('')}
                    ${results.campuses.length ? '</ul>' : ''}
                  <h2 class="search-overlay__section-title">Events</h2>
                    ${results.generalInfo.length ? '<ul class="linked-list min-list">': '<p>No Events found.</p>'}
                    ${results.generalInfo.map(data => `<li><a href="${data.permalink}">${data.title}</a> 
                    ${data.postType == 'post' ? `by ${data.authorName}` : ''}</li>`).join('')}
                    ${results.generalInfo.length ? '</ul>' : ''}
                </div>
              </div>
            `);
            this.isSpinnerVisible = false;
          });
        }.bind(this), 375);
      } else {
        this.searchResults.html('');
        this.isSpinnerVisible = false;
      }
    }
    this.prevValue = this.searchField.val();
  }

  keyPressDispatcher(e) {
    if (e.keyCode == 83 && !this.isOverlayOpen && !$("input, textarea").is(':focus')) {
      this.openOverlay();
    } else if (e.keyCode  == 27 && this.isOverlayOpen) {
      this.closeOverlay();
    }
  }

  openOverlay() {
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass("body-no-scroll");
    this.searchField.val('');
    setTimeout(() => this.searchField.focus(), 301);
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.searchOverlay.removeClass("search-overlay--active");
    $("body").removeClass("body-no-scroll");
    this.isOverlayOpen = false;
  }

  addSearch() {
    $("body").append(`
    <div class="search-overlay">
      <div class="search-overlay__top">
        <div class="container">
          <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
          <input type="text" class="search-term" placeholder="What are you looking for" id="search-term">
          <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
        </div>
      </div>

      <div class="container">
        <div id="search-overlay__results"></div>
      </div>
    </div>
    `);
  }
}


export default Search;