/* vim: set ts=2 et sw=2 tw=80: */
/* ***** BEGIN LICENSE BLOCK *****
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the "License"). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Firefox Muter.
 *
 * The Initial Developer of the Original Code is
 * the Mozilla Online.
 * Portions created by the Initial Developer are Copyright (C) 2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Yuan Xulei <xyuan@mozilla.com>
 *  Hector Zhao <bzhao@mozilla.com>
 *  Rui You <ryou@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var muter = (function() {
  let jsm = {};
  Cu.import("resource://muter/muterUtils.jsm", jsm);
  Cu.import("resource://muter/muterHook.jsm", jsm);
  Cu.import("resource://gre/modules/Services.jsm", jsm);
  Cu.import("resource://gre/modules/AddonManager.jsm", jsm);
  let {
    muterUtils, muterHook, Services, AddonManager
  } = jsm;

  var muter = {
    // Monitors the mute status and updates the UI
    _muterObserver: null,

    strings: {
      _bundle: Services.strings.createBundle('chrome://muter/locale/muter.properties'),
      get: function(name, args) {
        if (args) {
          args = Array.prototype.slice.call(arguments, 1);
          return this._bundle.formatStringFromName(name, args, args.length);
        } else {
          return this._bundle.GetStringFromName(name);
        }
      }
    },

    init: function(event) {
      window.removeEventListener("load", muter.init, false);

      muterHook.open();

      muter.showButton('muter-toolbar-palette-button');
      muter.logUsage();
      muter.updateUI();

      muter._muterObserver = new MuterObserver();
      muter._muterObserver.register();
    },

    destroy: function(event) {
      muterHook.close();
    },

    switchStatus: function(event) {
      let shouldMute = !muterHook.isMuteEnabled();
      muterHook.enableMute(shouldMute);
    },

    updateUI: function() {
      let isMuted = muterHook.isMuteEnabled();

      let btn = document.getElementById("muter-toolbar-palette-button");
      if (btn) {
        if (isMuted) {
          btn.classList.add("mute-enabled");
        } else {
          btn.classList.remove("mute-enabled");
        }
      }
    },

    /** Add the muter button to the addon bar or remove it */
    showButton: function(aId) {
      let widget = CustomizableUI.getWidget(aId);
      if (widget && widget.provider == CustomizableUI.PROVIDER_API) {
        return;
      }

      CustomizableUI.createWidget({
        id: aId,
        defaultArea: CustomizableUI.AREA_NAVBAR,
        label: this.strings.get('muter-button.label'),
        tooltiptext: this.strings.get('muter-button.tooltip'),
        onCommand : this.switchStatus
      });
    },

    logUsage: function() {
      try {
        Cu.import('resource://cmtracking/ExtensionUsage.jsm', this);
        this.ExtensionUsage.register('muter-toolbar-palette-button', 'window:button',
          'muter@mozillaonline.com');
      } catch(e) {};
    }
  };

  /**
   * Observer monitering the mute status.
   * If the status is changed, updates the UI of each window.
   */
  function MuterObserver() {};

  MuterObserver.prototype = {
    _branch: null,

    observe: function(subject, topic, data) {
      if (topic === "muter-status-changed") {
        muter.updateUI();
      }
    },

    register: function() {
      Services.obs.addObserver(this, "muter-status-changed", false);
    },

    unregister: function() {
      Services.obs.removeObserver(this, "muter-status-changed");
    },

  };

  window.addEventListener("load", muter.init, false);
  window.addEventListener("unload", muter.destroy, false);
  return muter;
})();
