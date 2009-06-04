function searchKnowledgeBase() {
    var query = req.get('q');

    return axiom.HTTP.get('http://localhost/search?r=true'+((query)?'&s='+query:'')).toSource();
}

function popularQueriesKnowledgeBase() {
    return axiom.HTTP.get('http://localhost/top_searches').toSource();
}