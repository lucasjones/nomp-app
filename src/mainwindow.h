#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include "util.h"
#include "aboutdialog.h"

#include <QMainWindow>
#include <QItemSelection>

namespace Ui {
class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

public slots:
    void poolSelectionChanged(QItemSelection current, QItemSelection previous);
    void keySelectionChanged(QItemSelection current, QItemSelection previous);

private slots:
    void on_actionAbout_triggered();

private:
    Ui::MainWindow *ui;
    StringList poolList;
    StringList keyList;
    AboutDialog *aboutDialog;
};

#endif // MAINWINDOW_H
