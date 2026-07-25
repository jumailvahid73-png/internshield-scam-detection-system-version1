<?php
/**
 * Plugin Name: Orient Tech Site Assets
 * Description: Loads the CSS, JS, fonts and images for the Orient Tech custom-coded pages. Pair with Elementor "HTML" widgets on each page (see PAGE-MAP.md).
 * Version: 1.0.0
 * Author: Orient Tech
 */

if (!defined('ABSPATH')) {
    exit;
}

function orienttech_enqueue_assets() {
    $base = plugin_dir_url(__FILE__) . 'assets/';

    wp_enqueue_style(
        'orienttech-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap',
        [],
        null
    );
    wp_enqueue_style(
        'orienttech-icons',
        'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
        [],
        '1.11.3'
    );
    wp_enqueue_style('orienttech-style', $base . 'css/style.css', [], '1.0.0');
    wp_enqueue_script('orienttech-main', $base . 'js/main.js', [], '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'orienttech_enqueue_assets');
