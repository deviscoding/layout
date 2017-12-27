/**
 * jQuery plugin to handle width overflow of bootstrap tabs in a manner similar to tab handling on Android.
 *
 * @version v1.1.2
 * @license https://github.com/strapless/layout/LICENSE
 * @author  Aaron M Jones <am@jonesiscoding.com>
 */
(function($) {

  $.tabScroll = function(element, options) {

    var defaults = {
      cls: {
        'toggle': 'dropdown-toggle',
        'wrapper': 'dropdown',
        'dropdown': 'dropdown-menu',
        'open': 'open',
        'marker': 'overflow-item'
      }
    };

    var plugin = this;

    /**
     * @type object
     */
    plugin.settings = {};

    var $el = $(element);

    plugin.init = function() {

      plugin.settings = $.extend({}, defaults, options);

      $(window).afterwards('resize', function () {
        plugin.toggleMarker(plugin.hasOverflow());
      });

      $(document).on('show.bs.dropdown', '[data-overflow="true"]', function(e) {
        var $dropdown = $(e.target).find(plugin.settings.cls.dropdown);
        var $trigger = $dropdown.parent('.' + plugin.settings.cls.wrapper).find('.' + plugin.settings.cls.toggle);
        var top = $trigger.offset().top + $trigger.outerHeight();
        var left = $trigger.offset().left;
        $dropdown.appendTo('body').css({left: left + 'px', top: top + 'px', 'max-height': 'calc(90vh - ' + top + 'px)', 'overflow-y': 'scroll' });
        $('body').addClass(plugin.settings.cls.open);
        $(this).on('hidden.bs.dropdown', function () {
          $dropdown.appendTo(e.target).css({});
          $('body').removeClass(plugin.settings.cls.open);
        })
      });

      if (!$(document).hasClass('.touch')) {
        $el.on('click', '.' + plugin.settings.cls.marker, function(e) { plugin.onClick(e); });
      }

      plugin.toggleMarker(plugin.hasOverflow());
    };

    /**
     * @returns {boolean}
     */
    plugin.hasOverflow = function() {
      var width = $el.innerWidth();
      var childWidth = 0;
      $el.children('li').each(function() {
        childWidth = childWidth + $(this).innerWidth();
      });

      return (width && width < childWidth);
    };

    /**
     * @param status
     */
    plugin.toggleMarker = function(status) {
      var sel = '.' + plugin.settings.cls.marker;
      var $marker = $el.find(sel);
      var hasMarker = (0 === $marker.length);
      if(status !== false) {
        if(hasMarker) {
          $marker = $('<span></span>');
          $marker.addClass(plugin.settings.cls.marker).appendTo($el);
          $el.on('scroll', function() {
            var left = $el.innerWidth() + $el.scrollLeft();
            $marker.css('left',left);
          });
        } else {
          $marker.show();
        }
      } else {
        if(hasMarker) {
          $marker.hide();
        }
      }
    };

    /**
     * @param e The click event.
     */
    plugin.onClick = function(e) {
      e.preventDefault();
      var leftPos = $el.scrollLeft();
      $el.animate({scrollLeft: leftPos + 200}, 800);
    };

    plugin.init();

  };

  /**
   * @param options
   * @returns {*}
   */
  $.fn.tabScroll = function(options) {
    return this.each(function() {
      if (undefined === $(this).data('tabScroll')) {
        var plugin = new $.tabScroll(this, options);
        $(this).data('tabScroll', plugin);
      }
    });
  };
})(jQuery);