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
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="sus-language/index.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">User Guide</li><li class="chapter-item expanded "><a href="installation/index.html"><strong aria-hidden="true">1.</strong> Installation</a></li><li class="chapter-item expanded "><a href="learningsus.html"><strong aria-hidden="true">2.</strong> Learning SUS</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="changelog-since-talk/index.html"><strong aria-hidden="true">2.1.</strong> Changelog since Talk</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Reference Guide</li><li class="chapter-item expanded "><a href="core-philosophy/index.html"><strong aria-hidden="true">3.</strong> Core Philosophy</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="what-sus-gives-you/index.html"><strong aria-hidden="true">3.1.</strong> What SUS gives you</a></li><li class="chapter-item expanded "><a href="planned/index.html"><strong aria-hidden="true">3.2.</strong> Planned</a></li><li class="chapter-item expanded "><a href="what-sus-does-not-do/index.html"><strong aria-hidden="true">3.3.</strong> What SUS does not do</a></li><li class="chapter-item expanded "><a href="example-of-some-sus-code-in-the-sus-vscode-language-server/index.html"><strong aria-hidden="true">3.4.</strong> SUS Code Examples</a></li></ol></li><li class="chapter-item expanded "><a href="example-of-some-sus-code-in-the-sus-vscode-language-server/index.html"><strong aria-hidden="true">4.</strong> Comparison to Other HDLs</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="the-old-guard-system-verilog-and-vhdl/index.html"><strong aria-hidden="true">4.1.</strong> The Old Guard: (System-)Verilog and VHDL</a></li><li class="chapter-item expanded "><a href="high-level-synthesis-bluespec-intel-oneapi-xilinx-vitis/index.html"><strong aria-hidden="true">4.2.</strong> High-Level Synthesis</a></li><li class="chapter-item expanded "><a href="embedded-languages-such-as-chisel-and-spinalhdl/index.html"><strong aria-hidden="true">4.3.</strong> Embedded Languages</a></li><li class="chapter-item expanded "><a href="new-hardware-design-languages-such-as-tl-verilog-spade-filament-rusthdl-and-now-sus/index.html"><strong aria-hidden="true">4.4.</strong> New HDLs</a></li></ol></li><li class="chapter-item expanded "><a href="main-features-through-examples/index.html"><strong aria-hidden="true">5.</strong> Main Features through examples</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="latency-counting/index.html"><strong aria-hidden="true">5.1.</strong> Pipelining through Latency Counting</a></li><li class="chapter-item expanded "><a href="fizz-buzz-lookup-table-using-generative-code/index.html"><strong aria-hidden="true">5.2.</strong> FIZZ-BUZZ Lookup Table using Generative Code</a></li><li class="chapter-item expanded "><a href="(clock-)-domains-for-separating-out-logically-distinct-pipelines/index.html"><strong aria-hidden="true">5.3.</strong> (Clock-) Domains for separating out logically distinct pipelines</a></li></ol></li><li class="chapter-item expanded "><a href="roadmap/index.html"><strong aria-hidden="true">6.</strong> Roadmap</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="major-milestones/index.html"><strong aria-hidden="true">6.1.</strong> Major Milestones</a></li><li class="chapter-item expanded "><a href="language-features/index.html"><strong aria-hidden="true">6.2.</strong> Language Features</a></li><li class="chapter-item expanded "><a href="performance-linking-and-name-resolution/index.html"><strong aria-hidden="true">6.3.</strong> Performance, Linking and Name Resolution</a></li><li class="chapter-item expanded "><a href="safety/index.html"><strong aria-hidden="true">6.4.</strong> Safety</a></li><li class="chapter-item expanded "><a href="typing-&-inference/index.html"><strong aria-hidden="true">6.5.</strong> Typing &amp; Inference</a></li><li class="chapter-item expanded "><a href="latency-counting/index.html"><strong aria-hidden="true">6.6.</strong> Latency Counting</a></li><li class="chapter-item expanded "><a href="lsp/index.html"><strong aria-hidden="true">6.7.</strong> LSP</a></li><li class="chapter-item expanded "><a href="code-generation.html"><strong aria-hidden="true">6.8.</strong> Code Generation</a></li><li class="chapter-item expanded "><a href="fun-projects-to-do-in-sus/index.html"><strong aria-hidden="true">6.9.</strong> Fun projects to do in SUS</a></li><li class="chapter-item expanded "><a href="safety-through-interface-asserts-pdl-style-asserts/index.html"><strong aria-hidden="true">6.10.</strong> Safety through Interface Asserts (PDL-style asserts)</a></li><li class="chapter-item expanded "><a href="simulation/index.html"><strong aria-hidden="true">6.11.</strong> Simulation</a></li></ol></li><li class="chapter-item expanded "><a href="architecture/index.html"><strong aria-hidden="true">7.</strong> Architecture</a></li><li class="chapter-item expanded affix "><a href="long-term-strategy/index.html">Long Term Strategy</a></li></ol>';
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
