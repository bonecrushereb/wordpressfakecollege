import $ from 'jquery';

class MyNotes {
  constructor() {
    this.events();
  }

    events() {
    $(".delete-note").on("click", this.deleteNote);
    $(".edit-note").on("click", this.editNote.bind(this));
    $(".update-note").on("click", this.updateNote.bind(this));
  }

    editNote(e) {
    var thisNote = $(e.target).parents("li");
    if (thisNote.data("state") == "editable") {
      this.noteReadOnly(thisNote);
    } else {
      this.noteEditable(thisNote);
    }
  }

  noteEditable(thisNote) {
    thisNote.find(".edit-note").html('<i class="fa fa-times" aria-hidden="true"></i> Cancel');
    thisNote.find(".note-title-field, .note-body-field").removeAttr("readonly").addClass("note-active-field");
    thisNote.find(".update-note").addClass("update-note--visible");
    thisNote.data("state", "editable");
  }

  noteReadOnly(thisNote) {
    thisNote.find(".edit-note").html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit');
    thisNote.find(".note-title-field, .note-body-field").attr("readonly", "readonly").removeClass("note-active-field");
    thisNote.find(".update-note").removeClass("update-note--visible");
    thisNote.data("state", "cancel");
  }

  updateNote(e) {
    const thisNote = $(e.target).parents('li');
    const noteUrl = universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id');

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: noteUrl,
      type: 'POST',
      data: {'title': thisNote.find('.note-title-field').val() ,'content': thisNote.find('.note-body-field').val()},
      success: (response) => {
        this.noteReadOnly(thisNote);
      },
      error: (response) => {
        console.log(response);
      }
    });
  }

  deleteNote(e) {
    const thisNote = $(e.target).parents('li');
    const noteUrl = universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id');
    if(confirm('Are you sure you want to delete ' + $('input').val() + '?')) { 
      $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: noteUrl,
      type: 'DELETE',
      success: (response) => {
        thisNote.slideUp();
      },
      error: (response) => {
        console.log(response);
      }
      });
    } else {
      return false;
    }
  }
}
export default MyNotes;