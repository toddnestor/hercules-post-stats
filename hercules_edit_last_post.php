<?php
/*
Plugin Name: Hercules Post Stats
Description: Adds a metabox to your post edit screen with stats about the post.
Author: Todd D. Nestor - todd.nestor@gmail.com
Version: 1.0
License: GNU General Public License v3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html
*/

/**
 * Class HercPostStats 
 *
 */
    class HercPostStats
    {
        /**
         * The constructor simply adds the link to the menu
         */
        function __construct()
        {
            add_filter('init', array( $this, 'TinymceInit' ) );
            add_action( 'admin_enqueue_scripts', array( $this, 'AddHercPostStatsScripts' ), 10, 1 );
            add_action( 'add_meta_boxes', array( $this, 'AddMetaBoxes' ) );
            add_action( 'save_post', array( $this, 'AddSaveMetaboxDataFunction' ), 10, 1 );
        }
        
        function TinymceInit() {
            // Hook to tinymce plugins filter
            add_filter( 'mce_external_plugins', array( $this, 'TinymcePlugin' ) );
        }
        
        function TinymcePlugin( $init ) {
            // We create a new plugin... linked to a js file.
            // Mine was created from a plugin... but you can change this to link to a file in your plugin
            $init['keyup_event'] =plugins_url( '/assets/js/herc_post_stats.js', __FILE__ );
            return $init;
        }
        
        function AddHercPostStatsScripts( $hook )
        {
            
            global $post;
            
            if ( $hook == 'post-new.php' || $hook == 'post.php' )
            {
                wp_enqueue_script(  'myscript', plugins_url( '/assets/js/herc_post_stats.js', __FILE__ ) );
            }
        }

        function AddMetaBoxes()
        {
            add_meta_box( 'metabox_language',  'Post Stats', array( $this, 'GeneratePostStatsMetabox' ), 'post','side','high' );
        }
        
        function AddSaveMetaboxDataFunction( $post_id )
        {
            if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
                return;
            
            if( $_POST && isset( $_POST['herc_this_writing_time'] ) )
            {
                update_post_meta( $post_id, 'herc_this_writing_time', $_POST['herc_this_writing_time'] );
            }
        }
        
        function GeneratePostStatsMetabox( $post )
        {
            $value = get_post_meta( $post->ID, 'herc_this_writing_time', true );
        ?>
        <div id="entheme3-in">
            <div class="section">
                <div class="row-fluid">
                    <div class="span7 offset1">
                        <div class="control">
                            <ul style="list-style: none;">
                                <li>
                                    <strong>Words this session: </strong><span id="herc_session_word_count"></span>
                                    <input type="hidden" id="herc_session_written_words" />
                                </li>
                                <li>
                                    <strong>Time spent writing this session: </strong><span id="herc_session_writing_time"></span>
                                    <input type="hidden" name="herc_writing_time" id="herc_writing_time_input" value="<?php echo $value; ?>" />
                                    <input type="hidden" name="herc_this_writing_time" id="herc_this_writing_time_input" />
                                </li>
                                <li>
                                    <strong>Total Words: </strong><span id="herc_word_count"></span>
                                </li>
                                <li>
                                    <strong>Total time spent writing: </strong><span id="herc_writing_time"></span>
                                </li>
                                <li>
                                    <strong>Average Reading Time: </strong><span id="herc_reading_time"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
        }
    }
    
//SInitiatest the class    
$herc_post_stats = new HercPostStats;

?>