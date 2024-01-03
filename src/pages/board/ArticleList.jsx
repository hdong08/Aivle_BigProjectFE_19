import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, Button} from "@nextui-org/react";

function ArticleList() {
    const nav = useNavigate();
    const [articleData, setArticleData] = useState([]);
    const token = sessionStorage.getItem('aivle19_token')

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/board/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            if(response.data) setArticleData(response.data)
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 10;

    const pages = Math.ceil(articleData.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return articleData.slice(start, end);
    }, [page, articleData]);

  return (
    <div style={{padding:'63px', position: 'relative'}}>
        <Table 
            bottomContent={
                <div className="flex w-full items-center">
                        <div className="flex-grow flex justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="secondary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                auto
                                color="secondary"
                                onClick={() => {
                                    // 글쓰기 페이지로 이동
                                }}
                            >
                                글 작성
                            </Button>
                        </div>
                    </div>
            }
            classNames={{
            wrapper: "min-h-[666px]",
        }}
        >
            <TableHeader>
                <TableColumn style={{display: 'flex', justifyContent: 'right', alignItems: 'center', paddingRight:'450px', paddingLeft:"189px"}} key="title">글 제목</TableColumn>
                <TableColumn key="user">작성자</TableColumn>
                <TableColumn style={{paddingLeft:'70px'}} key="created_at">작성 시간</TableColumn>
            </TableHeader>
            <TableBody items={items}>
                {(item) => (
                <TableRow className="cell-hover" key={item.post_id}>
                    {(columnKey) => 
                    <TableCell 
                        style={columnKey === 'title' ? {display: 'flex', justifyContent: 'center', alignItems: 'center'} : {}}
                        onClick ={() => {
                        if (columnKey === 'title') {
                            nav(`/board/${item.post_id}`);
                            }
                        }}>
                        {columnKey === 'created_at' ? new Date(getKeyValue(item, columnKey)).toLocaleString() : getKeyValue(item, columnKey)}
                    </TableCell>}
                </TableRow>
                )}
            </TableBody>
        </Table>

    </div>
  )
}

export default ArticleList