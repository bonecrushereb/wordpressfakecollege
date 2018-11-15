<?php

  if (!is_user_logged_in()) {
    wp_redirect(esc_url(site_url('/')));
    exit;
  }

  get_header();

  while(have_posts()) {
    the_post(); 
    pageBanner();
?>

  <div class="container container--narrow page-section">

  </div>
    
  <?php } get_footer(); ?>