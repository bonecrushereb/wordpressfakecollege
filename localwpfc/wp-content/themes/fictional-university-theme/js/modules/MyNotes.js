import $ from 'jquery';

class MyNotes {
  constructor() {
    this.deleteNote = $('.delete-note');
    this.events();
  }

  events() {
    const notesUrl = universityData.root_url + '/wp-json/wp/v2/note/121';
    this.deleteNote.on("click", () => {
      $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: notesUrl,
      type: 'DELETE',
      success: (response) => {
        console.log(response);
      },
      error: (response) => {
        console.log(response);
      }
    });
    });
  }
}

export default MyNotes;