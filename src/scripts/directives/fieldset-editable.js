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
            if(!scope.editModeActive) {
              enableEditMode(event);
            }
          });

          // Check for clicks everywhere!
          $('html').click(function() {
            if(scope.editModeActive) {
              disableEditMode();
            }
          });

          // Form was submitted
          $('form').submit(function() {
            disableEditMode(true);
          });


          $(element).click(function(event) {
            if($(event.target).is('.btn-submit')) {
              // console.log("ok");
              event.stopPropagation();
              disableEditMode(true);
            }
            if($(event.target).is('.btn-cancel')) {
              // console.log("cancel");
              event.stopPropagation();
              disableEditMode();
            }
            if(!$(event.target).is('.btn-cancel')) {
              event.stopPropagation();
            }
          });
          // $(element).find('input').blur(function() {
          //   disableEditMode();
          // });

          // Enable submit button on change
          $(element).find('input').on('input', function() {
            $('.btn-submit').prop('disabled', false);
          });


          function enableEditMode(event) {
            $(element).addClass('fieldset-editable-is-active');
            scope.editModeActive = true;
            var form = $(element).closest('form');
            scope.originalContents = $(form).serializeArray();
            // console.log(scope.originalContents);
            window.setTimeout (function(){
              event.currentTarget.select();
            }, 10);
            $(element).removeClass('fieldset-editable-is-hovered');
          }


          function disableEditMode(saveChanges) {
            saveChanges = typeof saveChanges !== 'undefined' ? saveChanges : false;

            if(saveChanges) {
              $('input').blur();
              console.log('Changes saved!');
            } else {
              var els = $(element).find(':input').get();
              console.log(els);
              values(scope.originalContents);

              // var data = scope.originalContents;

              // $.each(els, function() {
              //   console.log(this);
              //   if (this.name && !this.disabled && (this.checked
              //                   || /select|textarea/i.test(this.nodeName)
              //                   || /text|hidden|password/i.test(this.type))) {
              //       if(data[this.name] == undefined){
              //           data[this.name] = [];
              //       }
              //       data[this.name].push($(this).val());
              //   }
              // });

              // if(arguments.length === 0) {
              //   // return all data
              //   data = {};

              //   $.each(els, function() {
              //     if (this.name && !this.disabled && (this.checked
              //                       || /select|textarea/i.test(this.nodeName)
              //                       || /text|hidden|password/i.test(this.type))) {
              //       if(data[this.name] == undefined){
              //         data[this.name] = [];
              //       }
              //       data[this.name].push($(this).val());
              //     }
              //   });
              //   return data;

              // } else {
              //   $.each(els, function() {
              //     if (this.name && data[this.name]) {
              //       var names = data[this.name];
              //       var $this = $(this);
              //       if(Object.prototype.toString.call(names) !== '[object Array]'){
              //         names = [names]; //backwards compat to old version of this code
              //       }
              //       if(this.type == 'checkbox' || this.type == 'radio') {
              //         var val = $this.val();
              //         var found = false;
              //         for(var i = 0; i < names.length; i++){
              //           if(names[i] == val){
              //             found = true;
              //             break;
              //           }
              //         }
              //         $this.attr("checked", found);
              //       } else {
              //         $this.val(names[0]);
              //       }
              //     }
              //   });
              //   return this;
              // }


            }

            if($('input:focus').length === 0) {
              scope.editModeActive = false;
              $(element).removeClass('fieldset-editable-is-active');
              $('.btn-submit').prop('disabled', true);
            }
          }
        });

        function values(data) {
          console.log(data);
          var els = $(this).find(':input').get();

          if(typeof data != 'object') {
            // return all data
            data = {};

            $.each(els, function() {
              if (this.name && !this.disabled && (this.checked
                || /select|textarea/i.test(this.nodeName)
                || /text|hidden|password/i.test(this.type))) {
                data[this.name] = $(this).val();
              }
            });
            return data;
          } else {
          $.each(els, function() {
            if (this.name && data[this.name]) {
              if(this.type == 'checkbox' || this.type == 'radio') {
                $(this).attr("checked", (data[this.name] == $(this).val()));
              } else {
                $(this).val(data[this.name]);
              }
            }
          });
          return $(this);
          }
        };

      }
    };
  }]);