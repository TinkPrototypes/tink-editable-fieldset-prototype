'use strict';
angular.module('tink.fieldsetEditable', [])
  .directive('tinkFieldsetEditable', ['$timeout', function ($timeout) {
    return {
      restrict: 'AE',
      scope: {
        datumAansluiting: '='
      },
      link: function(scope, element) {

        jQuery(document).ready(function() {
          storeRadioButtonValuesInHiddenInputFields();
        });

        // jQuery(document).ready(function($) {
        $timeout(function() {

          // Scope variables
          scope.editModeActive = false;
          scope.originalContents = [];
          scope.checkboxClicked = '';


          // Datepicker
          // var test = $(element).find('data-tink-datepicker');
          // console.log(test);
          // var compiledElem = $compile(test)(scope);
          // test.replaceWith(compiledElem);


          // Hover behaviour
          $(element).find(':input, .faux-input, input[type=\'checkbox\'] + label, input[type=\'radio\'] + label').hover(function() {
            if(!scope.editModeActive) {
              $(element).addClass('fieldset-editable-is-hovered');
            }
          }, function() {
            if(!scope.editModeActive) {
              $(element).removeClass('fieldset-editable-is-hovered');
            }
          });


          // When input is focused, enable edit mode
          $(element).find(':input, .faux-input').focus(function(event) {
            if(!scope.editModeActive) {
              enableEditMode(event, '');
            }
          });
          $(element).find('input[type=\'checkbox\'], input[type=\'radio\']').change(function() {
            if(!scope.editModeActive) {
              enableEditMode(event, this);
            }
            $(element).find('.btn-submit').prop('disabled', false);
          });


          // Check for clicks everywhere!
          // $('html').click(function() {
          //   if(scope.editModeActive) {
          //     disableEditMode();
          //   }
          // });

          $(element).click(function(event) {
            if($(event.target).is('.btn-submit')) {
              event.stopPropagation();
              disableEditMode(true);
            }
            if($(event.target).is('.btn-cancel')) {
              event.stopPropagation();
              disableEditMode();
            }
            if(!$(event.target).is('.btn-cancel')) {
              event.stopPropagation();
            }
          });

          // Form was submitted
          $(element).find('form').submit(function() {
            disableEditMode(true);
          });


          // Enable submit button on change
          $(element).find(':input').on('input', function() {
            enableSubmitButton();
          });


          // Show input field when link is clicked
          $(element).find('.anchor-add').click(function() {
            $('.anchor-add').toggle(0);
            $('.input-add').toggle(0);
            $(this).next().find(':input').focus();
          });


          // Watch for ng-model-change on date field
          scope.$watchCollection('datumAansluiting', function(newValue, oldValue) {
            if(scope.editModeActive) {
              enableSubmitButton();
            } else {
              console.log('Edit mode not active!');
            }
            console.log(oldValue, newValue);
          }, true);

        });





        /**
         * Functions
         * ----------------------------------------------------------------
         */

        // Fields can be edited now
        function enableEditMode(event, checkbox) {
          $(element).addClass('fieldset-editable-is-active');
          scope.editModeActive = true;
          var form = $(element).closest('form');
          scope.originalContents = $(form).serializeArray();
          console.log(scope.originalContents);

          // Checkbox fix
          scope.checkboxClicked = checkbox;

          window.setTimeout (function(){
            try {
              event.currentTarget.select();
            } catch(e) {
            }
          }, 10);
          $(element).removeClass('fieldset-editable-is-hovered');
        }


        // Check if the user cancelled editing or not
        function disableEditMode(saveChanges) {
          saveChanges = typeof saveChanges !== 'undefined' ? saveChanges : false;
          var els = $(element).find(':input').get();
          $.each(els, function() {
            if(this.value === '' && this.type !== 'submit' && $(this).parents('.input-add').length > 0) {
              $(this).parents('.input-add').toggle(0);
              $(this).parents('.input-add').prev().toggle(0);
            }
          });

          if(saveChanges) {
            storeRadioButtonValuesInHiddenInputFields();
            $('input').blur();
            console.log('Changes saved!');
          } else {
            resetValues(scope.originalContents, els);
            console.log('Operation cancelled!');
          }


          // Primary buttons
          if($('input:focus').length === 0) {
            scope.editModeActive = false;
            $(element).removeClass('fieldset-editable-is-active');
            $('.btn-submit').prop('disabled', true);
          }
        }


        // Reset values
        function resetValues(data, els) {
          if(!$('.btn-submit').prop('disabled')) {

            var obj = {}; // Convert the serializeArray into an accesible object
            for (var i = 0, l = data.length; i < l; i++) {
                obj[data[i].name] = data[i].value;
            }

            $.each(els, function() {
              if (this.name && obj[this.name]) {
                if(this.type === 'checkbox') {
                  if(scope.checkboxClicked !== '') {
                    $(this).prop('checked', false); // Checkbox was initially unchecked and was clicked first
                  } else {
                    $(this).prop('checked', true); // Checkbox was initially checked and was not clicked first
                  }

                } else if(this.type === 'radio') { // Radio button was initially checked
                  if((this.value) === $('#' + this.name).val()) {
                    $(this).prop('checked', true);
                  } else {
                    $(this).prop('checked', false);
                  }

                } else {
                  $(this).val(obj[this.name]);
                }
              } else { // object is NOT in list
                if(this.type === 'checkbox') {
                  if(scope.checkboxClicked !== '') {
                    $(this).prop('checked', true); // Checkbox was initially checked and was clicked first
                  }

                } else if(this.type === 'radio') {
                  $(this).prop('checked', false); // Radio button was initially unchecked and was not clicked first

                } else {
                  $(this).val('');
                }
              }
            });
          }
          return true;
        }


        // Store radio button values in hidden input fields
        function storeRadioButtonValuesInHiddenInputFields() {
          var radiobuttons = $(element).find('input[type=\'radio\']').get();
          $.each(radiobuttons, function() {
            if(this.checked) {
              $('#' + this.name).val(this.value);
            }
          });
        }


        // Enable submit button
        function enableSubmitButton() {
          $(element).find('.btn-submit').prop('disabled', false);
        }


      }
    };
  }]);
