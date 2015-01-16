jQuery(document).ready(function ($)
{
    console.log('Hercules Post Stats is calculating the stats...');
    var startTime = new Date().getTime();
    startTime = startTime / 1000;
    var startTimeFromWP = ~~($('#herc_writing_time_input').val());
    startTimeFromWP = startTimeFromWP || 0;

    console.log('startTime: ' + startTimeFromWP);

    var ConvertSecondsToHHMMSS = function (seconds)
    {
        seconds = ~~seconds;
        var CurrentTime = '';

        if (seconds >= 3600)
        {
            var hours = ~~(seconds / 3600);
            seconds = seconds - ( hours * 3600 );
        }
        else {
            var hours = 0;
        }

        if (hours < 10)
        {
            CurrentTime += '0';
        }
        CurrentTime += hours + ':';

        if (seconds >= 60)
        {
            var minutes = ~~(seconds / 60);
            seconds = seconds - ( minutes * 60 );
        }
        else
        {
            var minutes = 0;
        }

        if (minutes < 10)
        {
            CurrentTime += '0';
        }
        CurrentTime += minutes + ':';

        if (seconds < 10)
        {
            CurrentTime += '0';
        }
        CurrentTime += seconds + '';

        return CurrentTime;
    }

    var CalculateCurrentTime = function ()
    {
        var origStartTime = startTime;

        var timeNow = new Date().getTime();
        timeNow = timeNow / 1000;

        var passedTime = ~~(timeNow - origStartTime);

        var totalTime = passedTime + startTimeFromWP;

        totalTime = ~~totalTime;

        var CurrentTime = ConvertSecondsToHHMMSS(totalTime);

        var CurrentSessionTime = ConvertSecondsToHHMMSS(passedTime);

        $('#herc_writing_time').html(CurrentTime);
        $('#herc_session_writing_time').html(CurrentSessionTime);
        $('#herc_this_writing_time_input').val(totalTime);
    }

    setInterval(function ()
    {
        CalculateCurrentTime();
    }, 500);

    var getContent = function ()
    {
        if (tinymce && null == tinymce.activeEditor)
        {
            // exit if the editor is not ready yet
            var data = $('#content-textarea-clone').text();
            if (!data.trim().length)
            {
                return $('#content').text().trim();
            }
            return data;
        }
        else
        {
            return $(tinymce.activeEditor.getContent()).text().trim();
        }
    };

    function RegExpEscape(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }

    function replaceEmoticons(text)
    {
        var emots = {
            ':)': '',
            ':(': '',
            ':P': '',
            ';)': '',
            ';(': '',
            ':-)': ''
        }

        var result = text;
        var emotcode;
        var regex;

        for (emotcode in emots)
        {
            regex = new RegExp(RegExpEscape(emotcode), 'gi');
            result = result.replace(regex, '');
        }

        return result;
    }

    function CountPostContentWords(tiny)
    {
        if (tiny == true) {
            var OriginalString = getContent();
        }
        else {
            var OriginalString = $('#content').val();
        }

        var ImageCount = OriginalString.split('<img').length - 1;

        var StrippedString = OriginalString.replace(/(<([^>]+)>)/ig, "");
        StrippedString = replaceEmoticons(StrippedString);
        StrippedString = StrippedString.trim();
        StrippedString = StrippedString.replace(/\s{2,}/g, ' ');
        var WordCount = StrippedString.split(' ').length - 1;

        var WordsPerMinute = 200;

        var TotalMinutes = WordCount / WordsPerMinute;

        var Minutes = ~~TotalMinutes;

        var Hours = ~~(Minutes / 60);

        Minutes = Minutes - ( Hours * 60 );

        var Seconds = ~~(( TotalMinutes - Minutes ) * 60);

        var ReadingTime = '';

        if (Hours > 0)
        {
            if (Hours < 10)
            {
                ReadingTime += "0";
            }

            ReadingTime += Hours + ":";
        }
        else
        {
            ReadingTime += "00:";
        }

        if (Minutes > 0)
        {
            if (Minutes < 10)
            {
                ReadingTime += "0";
            }

            ReadingTime += Minutes + ":";
        }
        else {
            ReadingTime += "00:";
        }

        if (Seconds > 0)
        {
            if (Seconds < 10)
            {
                ReadingTime += "0";
            }

            ReadingTime += Seconds;
        }
        else {
            ReadingTime += "00";
        }

        jQuery('#herc_word_count').html(WordCount);
        if ($('#herc_session_written_words').val() == '')
        {
            $('#herc_session_written_words').val(WordCount);
        }
        var InitialWordCount = parseInt($('#herc_session_written_words').val());
        var SessionWordCount = WordCount - InitialWordCount;
        jQuery('#herc_session_word_count').html(SessionWordCount);
        jQuery('#herc_reading_time').html(ReadingTime);
    }

    CountPostContentWords(true);

    jQuery("body").on('input keyup', function ()
    {
        CountPostContentWords(false);
        //console.log( tinymce.editors.activeEditor.getContent() );
    });

    // EVENTS
    tinymce.PluginManager.add('keyup_event', function (editor, url)
    {
        editor.on('input keyup', function ()
        {
            CountPostContentWords(true);
        });
    });

    CountPostContentWords(false);
});