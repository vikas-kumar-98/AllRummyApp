       // Mobile Menu Toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const dropdowns = document.querySelectorAll('.dropdown');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Mobile Dropdown Toggle
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && navLinks.classList.contains('active') && 
                !e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = 'auto';
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        });

        // Animation on scroll
        document.addEventListener('DOMContentLoaded', () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = `fadeIn 0.8s ease forwards`;
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.game-card, .stat-card').forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.animationDelay = `${index * 0.2}s`;
                observer.observe(card);
            });
        });




        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.querySelector('.nav-menu');
        
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Dropdown Menu Toggle for Mobile
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            
            if (link && (item.querySelector('.dropdown-menu') || item.querySelector('.mega-menu'))) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        const dropdown = item.querySelector('.dropdown-menu') || item.querySelector('.mega-menu');
                        dropdown.classList.toggle('active');
                        
                        const icon = link.querySelector('i');
                        if (icon) {
                            icon.style.transform = dropdown.classList.contains('active') 
                                ? 'rotate(180deg)' 
                                : 'rotate(0deg)';
                        }
                    }
                });
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && e.target !== mobileMenuBtn) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
  

//    <!--sercvh box scrit-->..........................

        document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const searchForm = document.getElementById('search-form');
            const searchInput = document.getElementById('search-input');
            const searchButton = document.querySelector('.search-button');
            const searchSuggestions = document.getElementById('search-suggestions');
            const searchHistory = document.getElementById('search-history');
            const historyList = document.getElementById('history-list');
            const clearHistoryBtn = document.getElementById('clear-history');
            
            // Mock data for autocomplete
            const mockCodeSnippets = [
                "function calculateTotal()",
                "const user = {name: 'John', age: 30}",
                "class UserController extends Controller",
                "def calculate_average(numbers):",
                "public static void main(String[] args)",
                "<div class='container'>",
                "SELECT * FROM users WHERE",
                "import React from 'react'",
                "interface UserInterface {",
                "for (let i = 0; i < array.length; i++)"
            ];
            
            // State
            let searchHistoryItems = JSON.parse(localStorage.getItem('searchHistory')) || [];
            let currentSuggestionIndex = -1;
            
            // Initialize
            updateHistoryDisplay();
            
            // Event Listeners
            searchInput.addEventListener('input', handleInput);
            searchInput.addEventListener('keydown', handleKeyDown);
            searchInput.addEventListener('focus', showHistory);
            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    searchSuggestions.classList.remove('visible');
                }, 200);
            });
            
            searchForm.addEventListener('submit', handleSearch);
            clearHistoryBtn.addEventListener('click', clearHistory);
            
            // Functions
            function handleInput(e) {
                const query = e.target.value.trim();
                
                if (query.length === 0) {
                    showHistory();
                    return;
                }
                
                // Get matching suggestions from our mock data
                const suggestions = getSuggestions(query);
                displaySuggestions(suggestions);
            }
        
            function getSuggestions(query) {
                if (!query) return [];
                
                const lowerQuery = query.toLowerCase();
                
                // First try to find exact matches
                const exactMatches = mockCodeSnippets.filter(snippet => 
                    snippet.toLowerCase().includes(lowerQuery)
                );
                
                // Then try to find partial matches
                const partialMatches = mockCodeSnippets.filter(snippet => 
                    snippet.toLowerCase().includes(lowerQuery) && 
                    !exactMatches.includes(snippet)
                );
                
                // Combine results (exact matches first)
                return [...exactMatches, ...partialMatches].slice(0, 5);
            }
            
            function displaySuggestions(suggestions) {
                searchSuggestions.innerHTML = '';
                
                if (suggestions.length === 0) {
                    searchSuggestions.classList.remove('visible');
                    return;
                }
                
                suggestions.forEach((suggestion, index) => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.classList.add('suggestion-item');
                    
                    // Highlight the matching part of the suggestion
                    const query = searchInput.value.trim().toLowerCase();
                    const matchIndex = suggestion.toLowerCase().indexOf(query);
                    
                    if (matchIndex >= 0 && query.length > 0) {
                        const before = suggestion.substring(0, matchIndex);
                        const match = suggestion.substring(matchIndex, matchIndex + query.length);
                        const after = suggestion.substring(matchIndex + query.length);
                        
                        suggestionItem.innerHTML = `${before}<strong>${match}</strong>${after}`;
                    } else {
                        suggestionItem.textContent = suggestion;
                    }
                    
                    suggestionItem.addEventListener('click', () => {
                        searchInput.value = suggestion;
                        searchSuggestions.classList.remove('visible');
                        handleSearch({ preventDefault: () => {} });
                    });
                    
                    searchSuggestions.appendChild(suggestionItem);
                });
                
                searchSuggestions.classList.add('visible');
            }
            
            function handleKeyDown(e) {
                const items = searchSuggestions.querySelectorAll('.suggestion-item');
                
                if (items.length === 0) return;
                
                // Down arrow
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentSuggestionIndex = Math.min(currentSuggestionIndex + 1, items.length - 1);
                    updateHighlightedSuggestion(items);
                }
                // Up arrow
                else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    currentSuggestionIndex = Math.max(currentSuggestionIndex - 1, -1);
                    updateHighlightedSuggestion(items);
                }
                // Enter
                else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (currentSuggestionIndex >= 0) {
                        searchInput.value = items[currentSuggestionIndex].textContent;
                        searchSuggestions.classList.remove('visible');
                    }
                    handleSearch({ preventDefault: () => {} });
                }
                // Escape
                else if (e.key === 'Escape') {
                    searchSuggestions.classList.remove('visible');
                }
            }
            
            function updateHighlightedSuggestion(items) {
                items.forEach((item, index) => {
                    item.classList.toggle('highlighted', index === currentSuggestionIndex);
                });
                
                if (currentSuggestionIndex >= 0) {
                    items[currentSuggestionIndex].scrollIntoView({
                        block: 'nearest'
                    });
                }
            }
            
            function handleSearch(e) {
                e.preventDefault();
                const query = searchInput.value.trim();
                
                if (query.length === 0) return;
                
                // Save to history
                addToHistory(query);
                
                // Hide suggestions
                searchSuggestions.classList.remove('visible');
                
                // For demo purposes, just show what would be searched
                console.log('Searching for:', query);
                alert(`Searching for: ${query}`);
            }
            
            function addToHistory(query) {
                // Remove if already exists
                searchHistoryItems = searchHistoryItems.filter(item => item !== query);
                
                // Add to beginning
                searchHistoryItems.unshift(query);
                
                // Limit to 10 items
                if (searchHistoryItems.length > 10) {
                    searchHistoryItems = searchHistoryItems.slice(0, 10);
                }
                
                // Save to localStorage
                localStorage.setItem('searchHistory', JSON.stringify(searchHistoryItems));
                
                // Update display
                updateHistoryDisplay();
            }
            
            function updateHistoryDisplay() {
                historyList.innerHTML = '';
                
                if (searchHistoryItems.length === 0) {
                    searchHistory.classList.remove('visible');
                    return;
                }
                
                searchHistory.classList.add('visible');
                
                searchHistoryItems.forEach(query => {
                    const li = document.createElement('li');
                    li.classList.add('history-item');
                    
                    const span = document.createElement('span');
                    span.classList.add('history-query');
                    span.textContent = query;
                    span.addEventListener('click', () => {
                        searchInput.value = query;
                        handleSearch({ preventDefault: () => {} });
                    });
                    
                    const deleteBtn = document.createElement('span');
                    deleteBtn.classList.add('history-delete');
                    deleteBtn.innerHTML = '<span class="icon close-icon"></span>';
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        removeFromHistory(query);
                    });
                    
                    li.appendChild(span);
                    li.appendChild(deleteBtn);
                    historyList.appendChild(li);
                });
            }
            
            function removeFromHistory(query) {
                searchHistoryItems = searchHistoryItems.filter(item => item !== query);
                localStorage.setItem('searchHistory', JSON.stringify(searchHistoryItems));
                updateHistoryDisplay();
            }
            
            function clearHistory() {
                searchHistoryItems = [];
                localStorage.removeItem('searchHistory');
                updateHistoryDisplay();
            }
            
            function showHistory() {
                if (searchInput.value.trim().length > 0 || searchHistoryItems.length === 0) {
                    searchHistory.classList.remove('visible');
                    return;
                }
                
                searchHistory.classList.add('visible');
            }
        });

//    --End of search box script-

//    --Start of faq script part-


        // Tab functionality
        const tabs = document.querySelectorAll('.faq-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all content
                document.querySelectorAll('.faq-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show selected content
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(`${tabId}-faq`).classList.add('active');
            });
        });
        
        // Accordion functionality
        const questions = document.querySelectorAll('.faq-question');
        questions.forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentNode;
                item.classList.toggle('active');
            });
        });
    
   // <!--End of faq script part-->

    //<!--Youtube script-->

        function openVideo(videoId) {
            // In a real implementation, you might:
            // 1. Open a modal with the YouTube iframe
            // 2. Redirect to YouTube page
            // 3. Use YouTube API to play inline
            
            // For this example, we'll just alert
            alert("Opening YouTube video: " + videoId);
            
            // Real implementation might look like:
            // window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
            
            // Or for a modal:
            /*
            const modal = document.createElement('div');
            modal.innerHTML = `
                <div class="video-modal">
                    <iframe width="560" height="315" 
                            src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                            frameborder="0" allowfullscreen></iframe>
                </div>
            `;
            document.body.appendChild(modal);
            */
        }
    
    //End of youtube script