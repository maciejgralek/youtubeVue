export default function createUrl(url, query) {
	let q = [];
	for (let i in query) {
		q.push(encodeURIComponent(i) + '=' + encodeURIComponent(query[i]))
	}
	url = url + q.join("&")
	return url
}

