package main

import (
	"fmt"
	"net/http"
	"os"
	"regexp"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.LoadHTMLGlob("./dist/*.html")
	router.Static("./assets", "./dist/assets")
	router.GET("/", func(ctx *gin.Context) {
		ctx.HTML(http.StatusOK, "index.html", gin.H{})
	})
	router.GET("/:path", func(ctx *gin.Context) {
		path := ctx.Param("path")
		if matched, _ := regexp.MatchString("^[0-9]+$", path); matched {
			ctx.HTML(http.StatusOK, "game.html", gin.H{"id": path})
		} else {
			_, err := os.Stat(path + ".html")
			if err == nil {
				ctx.HTML(http.StatusOK, path+".html", gin.H{})
			} else {
				ctx.AbortWithStatus(http.StatusNotFound)
			}
		}
	})
	router.Run(":8081")
}

func handleRegistry(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Handling Registry")
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Handling Login")
}
