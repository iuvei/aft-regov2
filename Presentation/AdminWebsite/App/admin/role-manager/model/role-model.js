﻿// Generated by IcedCoffeeScript 108.0.9
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(function(require) {
    var RoleModel, assign, baseModel, config, i18N, mapping;
    mapping = require("komapping");
    i18N = require("i18next");
    assign = require("controls/assign");
    baseModel = require("base/base-model");
    config = require("config");
    require("utils");
    return RoleModel = (function(_super) {
      __extends(RoleModel, _super);

      function RoleModel() {
        var security;
        RoleModel.__super__.constructor.apply(this, arguments);
        this.code = this.makeField().extend({
          required: true,
          minLength: 1,
          maxLength: 12
        }).extend({
          pattern: {
            message: i18N.t("admin.messages.roleCodeInvalid"),
            params: '^[A-Za-z0-9]+(?:[._\'-][A-Za-z0-9]+)*$'
          }
        });
        this.name = this.makeField().extend({
          required: true,
          minLength: 1,
          maxLength: 20
        }).extend({
          pattern: {
            message: i18N.t("admin.messages.roleNameInvalid"),
            params: '^[A-Za-z0-9]+(?:[._\'-][A-Za-z0-9]+)*$'
          }
        });
        this.description = this.makeField();
        this.roles = ko.observableArray();
        this.roleId = this.makeField();
        this.roleId.subscribe((function(_this) {
          return function(roleId) {
            if (roleId != null) {
              return $.get(config.adminApi("RoleManager/GetRole"), {
                id: roleId
              }).done(function(data) {
                return _this.checkedPermissions(data.checkedPermissions);
              });
            }
          };
        })(this));
        this.licensees = ko.observableArray();
        this.assignedLicensees = this.makeArrayField().extend({
          validation: {
            validator: (function(_this) {
              return function(val) {
                return (val != null ? val.length : void 0) > 0;
              };
            })(this),
            message: i18N.t("admin.messages.licenseesRequired"),
            params: true
          }
        });
        this.displayLicensees = ko.observable();
        this.assignedLicensees.subscribe((function(_this) {
          return function(licensees) {
            if (licensees != null) {
              return $.ajax({
                type: "POST",
                url: config.adminApi("RoleManager/GetLicenseeData"),
                data: ko.toJSON(licensees),
                dataType: "json",
                contentType: "application/json"
              }).done(function(data) {
                return _this.roles(data.roles);
              });
            }
          };
        })(this));
        this.checkedPermissions = ko.observableArray();
        security = require("security/security");
        this.isLicenseeLocked = ko.computed((function(_this) {
          return function() {
            return (security.licensees() != null) && security.licensees().length > 0 && !security.isSuperAdmin();
          };
        })(this));
        this.selectedModules = ko.computed({
          read: (function(_this) {
            return function() {
              var operations;
              operations = security.operations().filter(function(o) {
                var _ref;
                return _ref = o.id, __indexOf.call(_this.checkedPermissions(), _ref) >= 0;
              });
              return operations.unique(function(o) {
                return o.module;
              }).map(function(o) {
                return {
                  id: Math.random(),
                  name: o.module,
                  permissions: operations.filter(function(p) {
                    return p.module === o.module;
                  }).map(function(p) {
                    return p.name;
                  }).join("\n")
                };
              });
            };
          })(this)
        });
      }

      return RoleModel;

    })(baseModel);
  });

}).call(this);
