'use strict';
angular.module('tink.fieldsetEditable', [])
  .directive('tinkFieldsetEditable', [function () {
    return {
      restrict: 'AE',
      scope: {
        // editModeActive: '='
      },
      link: function(scope, element) {

        jQuery(document).ready(function($) {

          scope.editModeActive = false;
          scope.originalContents = 'bla';

          // Hover behaviour
          $(element).find('input').hover(function() {
            if(!scope.editModeActive) {
              $(element).addClass('fieldset-editable-is-hovered');
            }
          }, function() {
            if(!scope.editModeActive) {
              $(element).removeClass('fieldset-editable-is-hovered');
            }
          });

          // When input is focused, enable edit mode
          $(element).find('input').focus(function(event) {
            enableEditMode(event);
          });

          // When input is blurred, disable edit mode
          $(element).find('input').blur(function() {
            disableEditMode();
          });

          // Enable submit button on change
          $(element).find('input').on('input', function() {
            $('#submitBtn').prop('disabled', false);
          });


          function enableEditMode(event) {
            $(element).addClass('fieldset-editable-is-active');
            scope.editModeActive = true;
            var form = $(element).closest('form');
            scope.originalContents = $(form).serializeArray();
            console.log(scope.originalContents);
            window.setTimeout (function(){
              event.currentTarget.select();
            }, 10);
            $(element).removeClass('fieldset-editable-is-hovered');
          }

          function disableEditMode() {
            if($('input:focus').length === 0) {
              scope.editModeActive = false;
              $(element).removeClass('fieldset-editable-is-active');
              $('#submitBtn').prop('disabled', true);
            }
          }
        });

      }
    };
  }]);