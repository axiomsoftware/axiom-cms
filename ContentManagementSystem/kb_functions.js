function searchKnowledgeBase() {
    var query = req.get('s');
    var data = {};
    if (query) {
	data.s = query;
    }
    return axiom.HTTP.get('http://kb.axiomcms.com/remote_search', data);
}

function popularQueriesKnowledgeBase() {
    return axiom.HTTP.get('http://kb.axiomcms.com/top_searches');
}