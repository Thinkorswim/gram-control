import { Settings } from './models/Settings';

export default defineContentScript({
  matches: ['*://*.instagram.com/*'],
  runAt: 'document_start',
  main(ctx) {
    let settings: Settings | null = null;
    let observers: MutationObserver[] = [];
    let processedHomeLinks = new Set<Element>();

    // Load settings from browser storage
    const loadSettings = async (): Promise<Settings> => {
      return new Promise((resolve) => {
        browser.storage.local.get(["settings"], (data) => {
          if (data.settings) {
            resolve(Settings.fromJSON(data.settings));
          } else {
            // Use default settings if none found
            resolve(new Settings());
          }
        });
      });
    };
    const removeExplorePageLink = () => {
      if (!settings?.explorePageDisabled) return;

      const exploreSvg = document.querySelector('svg[aria-label="Explore"]');
      if (exploreSvg) {
        let currentElement = exploreSvg.parentElement;
        let divCount = 0;

        // Traverse up the DOM tree to find the 6th div parent to remove the Explore page link
        while (currentElement && divCount < 6) {
          if (currentElement.tagName.toLowerCase() === 'div') {
            divCount++;
            if (divCount === 6) {
              currentElement.remove();
              return;
            }
          }
          currentElement = currentElement.parentElement;
        }
      }
    };

    const removeReelsPageLink = () => {
      if (!settings?.reelsPageDisabled) return;

      const reelsSvg = document.querySelector('svg[aria-label="Reels"]');
      if (reelsSvg) {
        let currentElement = reelsSvg.parentElement;
        let divCount = 0;

        // Traverse up the DOM tree to find the 6th div parent
        while (currentElement && divCount < 6) {
          if (currentElement.tagName.toLowerCase() === 'div') {
            divCount++;
            if (divCount === 6) {
              currentElement.remove();
              return;
            }
          }
          currentElement = currentElement.parentElement;
        }
      }
    };

    const removeSuggestedForYouOnMainPage = () => {
      if (!settings?.recommendationsDisabled) return;

      const targetDivs = document.querySelectorAll('div.x1dr59a3.x13vifvy.x7vhb2i.x6bx242');
      if (targetDivs.length > 0) {
        targetDivs.forEach(div => {
          const firstChild = div.children[0];
          if (firstChild && firstChild.children.length >= 3) {

            // We remove in reverse order to avoid index shifting
            if (firstChild.children[2]) {
              console.log('Removing third child of first child in suggested for you');
              firstChild.children[2].remove();
            }
            if (firstChild.children[1]) {
              console.log('Removing second child of first child in suggested for you');
              firstChild.children[1].remove();
            }
          }
        });
      }
    };

    const removeSuggestedForYouOnProfilePage = () => {
      if (!settings?.suggestedFriendsDisabled) return;

      const targetHeaders = document.querySelectorAll('header.xrvj5dj.xl463y0.x1ec4g5p.xdj266r.xwy3nlu.xh8yej3');
      if (targetHeaders.length > 0) {
        targetHeaders.forEach(header => {
          const parentDiv = header.parentElement;
          if (parentDiv && parentDiv.children.length >= 4) {
            const fourthChild = parentDiv.children[3];
            fourthChild.remove();
          }
        });
      }
    };

    const removePopupComments = () => {
      if (!settings?.commentsDisabled) return;

      const targetUls = document.querySelectorAll('ul._a9ym');
      if (targetUls.length > 0) {
        // Only process the first detected comment element
        const firstUl = targetUls[0];
        try {
          if (firstUl.parentNode) {
            // Remove the additional comments drop down
            let parent = firstUl as Element | null;
            for (let i = 0; i < 5 && parent; i++) {
              parent = parent.parentElement;
            }
            if (parent && parent.children.length >= 2) {
              parent.children[1].remove();
            }

            // Remove all comments
            let targetElement: Element | null = firstUl;
            for (let i = 0; i < 3 && targetElement; i++) {
              targetElement = targetElement.parentElement;
            }
            if (targetElement && targetElement.parentNode) {
              targetElement.remove();
            }
          }
        } catch (error) {
          console.log('Error removing popup comments:', error);
        }
      }
    };

    const removeCommentIcon = () => {
      if (!settings?.commentsDisabled) return;

      const titleElements = document.querySelectorAll('title');
      titleElements.forEach(title => {
        if (title.textContent && title.textContent.trim() === 'Comment') {
          try {
            // Remove the third-level parent of the Comment title
            let targetElement = title.parentElement?.parentElement?.parentElement;
            if (targetElement) {
              targetElement.remove();
            }
          } catch (error) {
            console.log('Error removing comment icon:', error);
          }
        }
      });

      // Also remove "View all" comments links
      const allSpans = document.querySelectorAll('span');
      allSpans.forEach(span => {
        if (span.textContent && span.textContent.trim().toLowerCase().includes('view all')) {
          try {
            span.remove();
          } catch (error) {
            console.log('Error removing View all span:', error);
          }
        }
      });
    };

    const waitForCommentIconsAndRemove = () => {
      if (!settings?.commentsDisabled) return;

      // Only run on Instagram root page
      if (window.location.pathname !== '/' && window.location.pathname !== '') return;

      const checkForCommentIcons = () => {
        // Double-check we're still on root page
        if (window.location.pathname !== '/' && window.location.pathname !== '') return false;

        const titleElements = document.querySelectorAll('title');
        const commentTitles = Array.from(titleElements).filter(title =>
          title.textContent && title.textContent.trim() === 'Comment'
        );

        if (commentTitles.some(title => title.parentElement?.parentElement?.parentElement)) {
          removeCommentIcon();
          return true;
        }
        return false;
      };

      // Try immediately first
      checkForCommentIcons();

      // Keep observer running continuously for infinite scroll, but only on root page
      const commentObserver = new MutationObserver((mutations) => {
        checkForCommentIcons();
      });
      observers.push(commentObserver);

      commentObserver.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
      });
    };

    // Remove comments on directly linked post pages
    const removeStaticComments = () => {
      if (!settings?.commentsDisabled) return;

      const targetDivs = document.querySelectorAll('div.x78zum5.xdt5ytf.x1iyjqo2');
      if (targetDivs.length > 0) {
        targetDivs.forEach(div => {
          const classList = Array.from(div.classList);
          const expectedClasses = ['x78zum5', 'xdt5ytf', 'x1iyjqo2'];

          if (classList.length === expectedClasses.length &&
            expectedClasses.every(cls => classList.includes(cls))) {
            try {
              div.remove();
            } catch (error) {
              console.log('Error removing static comments div:', error);
            }
          }
        });
      }
    };

    const waitForPopupCommentsAndRemove = () => {
      if (!settings?.commentsDisabled) return;

      const checkForPopupComments = () => {
        const targetUls = document.querySelectorAll('ul._a9ym');
        if (targetUls.length > 0) {
          removePopupComments();
          return true;
        }
        return false;
      };

      // Try immediately first
      if (checkForPopupComments()) {
        return;
      }

      // If not found, use MutationObserver to wait for the popup comments to appear
      const popupObserver = new MutationObserver((mutations) => {
        if (checkForPopupComments()) {
          popupObserver.disconnect();
          // Remove from observers array when disconnected
          const index = observers.indexOf(popupObserver);
          if (index > -1) observers.splice(index, 1);
        }
      });
      observers.push(popupObserver);

      popupObserver.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
      });

      // Fallback timeout in case content never loads
      setTimeout(() => {
        popupObserver.disconnect();
        const index = observers.indexOf(popupObserver);
        if (index > -1) observers.splice(index, 1);
      }, 10000); // 10 second max wait
    };

    const waitForSuggestedFriendsAndRemove = () => {
      if (!settings?.suggestedFriendsDisabled) return;

      const checkForContent = () => {
        const targetHeaders = document.querySelectorAll('header.xrvj5dj.xl463y0.x1ec4g5p.xdj266r.xwy3nlu.xh8yej3');
        if (targetHeaders.length > 0) {
          // Check if the parent has enough children (specifically the third child we need to remove)
          for (const header of targetHeaders) {
            const parentDiv = header.parentElement;
            if (parentDiv && parentDiv.children.length >= 4) {
              removeSuggestedForYouOnProfilePage();
              return true;
            }
          }
        }
        return false;
      };

      // Try immediately first
      if (checkForContent()) {
        return;
      }

      // If not found, use MutationObserver to wait for the content to appear
      const contentObserver = new MutationObserver((mutations) => {
        if (checkForContent()) {
          contentObserver.disconnect();
          // Remove from observers array when disconnected
          const index = observers.indexOf(contentObserver);
          if (index > -1) observers.splice(index, 1);
        }
      });
      observers.push(contentObserver);

      contentObserver.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
      });

      // Fallback timeout in case content never loads
      setTimeout(() => {
        contentObserver.disconnect();
        const index = observers.indexOf(contentObserver);
        if (index > -1) observers.splice(index, 1);
      }, 10000); // 10 second max wait
    };

    const redirectHomeLinks = () => {
      if (!settings?.recommendationsDisabled) return;

      // Find all anchor elements with href="/" and make the link to "/?variant=following"
      document.querySelectorAll('a[href="/"]')?.forEach(e => {
        // Skip if already processed
        if (processedHomeLinks.has(e)) return;
        processedHomeLinks.add(e);

        try {
          e.setAttribute("href", "/?variant=following");
          e.addEventListener("click", function (ev) {
            ev.preventDefault();
            ev.stopImmediatePropagation(); // blocks all existing click listeners
            if (window.location.href !== "https://www.instagram.com/?variant=following") {
              window.location.href = "https://www.instagram.com/?variant=following";
            }
          }, { once: false, passive: false });
        } catch (error) {
          console.log('Error redirecting home link:', error);
        }
      });
    };

    const waitForHomeLinksAndRedirect = () => {
      if (!settings?.recommendationsDisabled) return;

      const checkForHomeLinks = () => {
        const homeLinks = document.querySelectorAll('a[href="/"]');
        if (homeLinks.length > 0) {
          redirectHomeLinks();
          return true;
        }
        return false;
      };

      // Try immediately first
      checkForHomeLinks();

      // Keep observer running continuously for dynamically loaded content
      const linkObserver = new MutationObserver((mutations) => {
        checkForHomeLinks();
      });
      observers.push(linkObserver);

      linkObserver.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href']
      });
    };

    // Wait for DOM to be ready and then check for the element
    const initializeRemoval = async () => {
      // Load settings first
      settings = await loadSettings();

      const interceptNavigation = () => {
        const redirectIfNeeded = () => {
          if (!settings?.recommendationsDisabled) return; 
          if (location.pathname === "/" || location.pathname === "") {
            if (!location.search.includes("variant=following")) {
              location.replace("/?variant=following");
            }
          }
        };

        redirectIfNeeded();
        
        const origPush = history.pushState;
        history.pushState = function (...args) {
          origPush.apply(this, args as any);
          redirectIfNeeded();
        };

        const origReplace = history.replaceState;
        history.replaceState = function (...args) {
          origReplace.apply(this, args as any);
          redirectIfNeeded();
        };

        // Back/forward buttons
        window.addEventListener("popstate", redirectIfNeeded);
      };

      // 3. Run the interceptor after loading settings
      interceptNavigation();

      const removeElements = () => {
        removeExplorePageLink();
        removeReelsPageLink();
        removeSuggestedForYouOnMainPage();
        waitForSuggestedFriendsAndRemove();
        removeStaticComments();
        waitForCommentIconsAndRemove();
        waitForHomeLinksAndRedirect();
      };

      // Run removal on initial load
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeElements);
      } else {
        removeElements();
      }

      // Listen for URL changes (for single-page app navigation)
      let currentUrl = location.href;
      const urlChangeObserver = new MutationObserver(() => {
        if (location.href !== currentUrl) {
          currentUrl = location.href;
          waitForPopupCommentsAndRemove();
        }
      });
      observers.push(urlChangeObserver);

      urlChangeObserver.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
      });

      // Also set up a mutation observer to catch dynamically added elements
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                // Check if the added node contains our target elements
                if ((settings?.explorePageDisabled && element.querySelector?.('svg[aria-label="Explore"]')) ||
                  (settings?.reelsPageDisabled && element.querySelector?.('svg[aria-label="Reels"]')) ||
                  (settings?.recommendationsDisabled && element.querySelector?.('div.x1dr59a3.x13vifvy.x7vhb2i.x6bx242')) ||
                  (settings?.recommendationsDisabled && element.classList?.contains('x1dr59a3') && element.classList?.contains('x13vifvy')) ||
                  (settings?.suggestedFriendsDisabled && element.querySelector?.('header.xrvj5dj.xl463y0.x1ec4g5p')) ||
                  (settings?.suggestedFriendsDisabled && element.classList?.contains('xrvj5dj') && element.classList?.contains('xl463y0')) ||
                  (settings?.commentsDisabled && element.querySelector?.('ul._a9ym')) ||
                  (settings?.commentsDisabled && element.classList?.contains('_a9ym')) ||
                  (settings?.recommendationsDisabled && element.querySelector?.('a[href="/"]')) ||
                  (settings?.recommendationsDisabled && element.tagName?.toLowerCase() === 'a' && element.getAttribute?.('href') === '/')) {
                  removeElements();
                  break;
                }
              }
            }
          }
        }
      });
      observers.push(observer);

      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
      });

      // Clean up all observers when context is invalidated
      ctx.onInvalidated(() => {
        observers.forEach(observer => observer.disconnect());
        observers.length = 0;
        processedHomeLinks.clear();
      });
    };

    // Initialize the removal logic
    initializeRemoval();

    // Listen for settings changes from the popup
    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes.settings) {
        settings = Settings.fromJSON(changes.settings.newValue);
      }
    });
  },
});