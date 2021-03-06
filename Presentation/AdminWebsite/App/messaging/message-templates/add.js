﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var AddViewModel, aceEditor, addTemplateModel, baseModel, i18n, nav;
    nav = require("nav");
    i18n = require("i18next");
    baseModel = require("base/base-view-model");
    addTemplateModel = require("messaging/message-templates/models/add-template-model");
    aceEditor = require("ace-editor");
    return AddViewModel = (function(_super) {
      __extends(AddViewModel, _super);

      function AddViewModel() {
        AddViewModel.__super__.constructor.apply(this, arguments);
        this.SavePath = "/MessageTemplate/Add";
        this.Model = new addTemplateModel();
      }

      AddViewModel.prototype.compositionComplete = function() {
        new aceEditor("add-template-editor-subject", this.Model.subject, true, true);
        return new aceEditor("add-template-editor-message", this.Model.messageContent, true, false);
      };

      AddViewModel.prototype.handleSaveFailure = function(response) {
        var error, field, fields, _i, _len, _results;
        fields = response != null ? response.fields : void 0;
        if (fields != null) {
          _results = [];
          for (_i = 0, _len = fields.length; _i < _len; _i++) {
            field = fields[_i];
            error = field.errors[0];
            _results.push(this.setError(this.Model[field.name], i18n.t("app:messageTemplates.validation." + error)));
          }
          return _results;
        }
      };

      AddViewModel.prototype.onsave = function(data) {
        $(document).trigger("message_template_changed");
        nav.close();
        return nav.open({
          path: "messaging/message-templates/view",
          title: i18n.t("app:common.view"),
          data: {
            id: data.data
          }
        });
      };

      return AddViewModel;

    })(baseModel);
  });

}).call(this);
