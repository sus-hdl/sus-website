// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="sus-language.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">User Guide</li><li class="chapter-item expanded "><a href="installation.html"><strong aria-hidden="true">1.</strong> Installation</a></li><li class="chapter-item expanded "><a href="learningsus.html"><strong aria-hidden="true">2.</strong> Learning SUS</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="changelog-since-talk.html"><strong aria-hidden="true">2.1.</strong> Changelog since Talk</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">philosophy</li><li class="chapter-item expanded "><a href="compiletime_and_runtime.html"><strong aria-hidden="true">3.</strong> Compiletime and Runtime</a></li><li class="chapter-item expanded "><a href="control_flow.html"><strong aria-hidden="true">4.</strong> Control Flow</a></li><li class="chapter-item expanded "><a href="design_decisions.html"><strong aria-hidden="true">5.</strong> Design Decisions</a></li><li class="chapter-item expanded "><a href="instantiation.html"><strong aria-hidden="true">6.</strong> Instantiation</a></li><li class="chapter-item expanded "><a href="interfaces.html"><strong aria-hidden="true">7.</strong> Interfaces</a></li><li class="chapter-item expanded "><a href="latency.html"><strong aria-hidden="true">8.</strong> Latency</a></li><li class="chapter-item expanded "><a href="library.html"><strong aria-hidden="true">9.</strong> Library</a></li><li class="chapter-item expanded "><a href="optimization.html"><strong aria-hidden="true">10.</strong> Optimization</a></li><li class="chapter-item expanded "><a href="state.html"><strong aria-hidden="true">11.</strong> State</a></li><li class="chapter-item expanded "><a href="state_v_latency.html"><strong aria-hidden="true">12.</strong> State vs Latency</a></li><li class="chapter-item expanded "><a href="template_troubles.html"><strong aria-hidden="true">13.</strong> The Trouble with Parsing Templates</a></li><li class="chapter-item expanded "><a href="tensions.html"><strong aria-hidden="true">14.</strong> Tensions</a></li><li class="chapter-item expanded "><a href="tree_sitter.html"><strong aria-hidden="true">15.</strong> Tree Sitter</a></li><li class="chapter-item expanded "><a href="types.html"><strong aria-hidden="true">16.</strong> Types</a></li><li class="chapter-item expanded "><a href="core-philosophy.html"><strong aria-hidden="true">17.</strong> Core Philosophy</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="what-sus-gives-you.html"><strong aria-hidden="true">17.1.</strong> What SUS gives you</a></li><li class="chapter-item expanded "><a href="planned.html"><strong aria-hidden="true">17.2.</strong> Planned</a></li><li class="chapter-item expanded "><a href="what-sus-does-not-do.html"><strong aria-hidden="true">17.3.</strong> What SUS does not do</a></li><li class="chapter-item expanded "><a href="example-of-some-sus-code-in-the-sus-vscode-language-server.html"><strong aria-hidden="true">17.4.</strong> SUS Code Examples</a></li></ol></li><li class="chapter-item expanded "><a href="comparison-to-other-HDLs.html"><strong aria-hidden="true">18.</strong> Comparison to Other HDLs</a></li><li class="chapter-item expanded "><a href="main-features-through-examples.html"><strong aria-hidden="true">19.</strong> Main Features through examples</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="latency-counting/main-features-through-examples.html"><strong aria-hidden="true">19.1.</strong> Pipelining through Latency Counting</a></li><li class="chapter-item expanded "><a href="fizz-buzz-lookup-table-using-generative-code.html"><strong aria-hidden="true">19.2.</strong> FIZZ-BUZZ Lookup Table using Generative Code</a></li><li class="chapter-item expanded "><a href="(clock-)-domains-for-separating-out-logically-distinct-pipelines.html"><strong aria-hidden="true">19.3.</strong> (Clock-) Domains for separating out logically distinct pipelines</a></li></ol></li><li class="chapter-item expanded "><a href="roadmap.html"><strong aria-hidden="true">20.</strong> Roadmap</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="major-milestones.html"><strong aria-hidden="true">20.1.</strong> Major Milestones</a></li><li class="chapter-item expanded "><a href="language-features.html"><strong aria-hidden="true">20.2.</strong> Language Features</a></li><li class="chapter-item expanded "><a href="performance-linking-and-name-resolution.html"><strong aria-hidden="true">20.3.</strong> Performance, Linking and Name Resolution</a></li><li class="chapter-item expanded "><a href="safety.html"><strong aria-hidden="true">20.4.</strong> Safety</a></li><li class="chapter-item expanded "><a href="typing-&-inference.html"><strong aria-hidden="true">20.5.</strong> Typing &amp; Inference</a></li><li class="chapter-item expanded "><a href="latency-counting.html"><strong aria-hidden="true">20.6.</strong> Latency Counting</a></li><li class="chapter-item expanded "><a href="lsp.html"><strong aria-hidden="true">20.7.</strong> LSP</a></li><li class="chapter-item expanded "><a href="code-generation.html"><strong aria-hidden="true">20.8.</strong> Code Generation</a></li><li class="chapter-item expanded "><a href="fun-projects-to-do-in-sus.html"><strong aria-hidden="true">20.9.</strong> Fun projects to do in SUS</a></li><li class="chapter-item expanded "><a href="safety-through-interface-asserts-pdl-style-asserts.html"><strong aria-hidden="true">20.10.</strong> Safety through Interface Asserts (PDL-style asserts)</a></li><li class="chapter-item expanded "><a href="simulation.html"><strong aria-hidden="true">20.11.</strong> Simulation</a></li></ol></li><li class="chapter-item expanded "><a href="architecture.html"><strong aria-hidden="true">21.</strong> Architecture</a></li><li class="chapter-item expanded affix "><a href="long-term-strategy.html">Long Term Strategy</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
