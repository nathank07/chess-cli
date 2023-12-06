package main

import (
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("./dist"))
	http.Handle("/", fs)

	if err := http.ListenAndServe(":8081", nil); err != nil {
		panic(err)
	}
}
