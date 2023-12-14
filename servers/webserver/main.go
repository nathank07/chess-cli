package main

import (
	_ "encoding/gob"
	"net/http"
	"os"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	_ "github.com/mattn/go-sqlite3"
)

const dbLoc = "./servers/db/data.db"

var store = sessions.NewCookieStore([]byte("secret"))

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
			return
		}
		_, err := os.Stat("dist/" + path + ".html")
		session, _ := store.Get(ctx.Request, "login-session")
		if err != nil {
			ctx.Redirect(http.StatusNotFound, "/")
			panic(err)
		}
		if path == "login" {
			if session.Values["username"] == nil {
				ctx.HTML(http.StatusOK, path+".html", gin.H{})
			} else {
				ctx.Redirect(http.StatusFound, "/")
			}
			return
		}
		if path == "" || path == "game" {
			ctx.Redirect(http.StatusNotFound, "/")
			return
		}
		ctx.HTML(http.StatusOK, path+".html", gin.H{})
	})
	router.POST("/login", handleLogin)
	router.POST("/register", handleRegistry)
	router.POST("/token", handleToken)
	router.Run(":8081")
}
